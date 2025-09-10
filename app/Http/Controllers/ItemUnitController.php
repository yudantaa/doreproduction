<?php

namespace App\Http\Controllers;

use App\Models\ItemUnit;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ItemUnitController extends Controller
{
    public function index()
    {
        return Inertia::render('item-unit/item-unit-index', [
            'itemUnits' => ItemUnit::with('item')->get(),
            'items' => Item::all()->map(fn($item) => [
                'id' => $item->id,
                'nama_barang' => $item->nama_barang,
                'base_code' => $item->base_code,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_barang' => 'required|exists:items,id',
            'kode_unit' => 'required|string|max:255|regex:/^[A-Z0-9\-]+$/|unique:item_units,kode_unit',
            'status' => 'required|in:Tersedia,Tidak Tersedia,Rusak,Dalam Perbaikan,Disewa,Sedang Ditahan',
        ]);

        try {
            DB::beginTransaction();

            $itemUnit = ItemUnit::create($validatedData);

            DB::commit();

            // Send notification AFTER successful creation
            $this->sendItemUnitCreatedNotification($itemUnit);

            return redirect()->route('item-units.index')->with('success', 'Unit berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menambahkan unit: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, ItemUnit $itemUnit)
    {
        // Validation: Check if unit is currently being used
        if ($itemUnit->status === 'Disewa') {
            $hasActiveLoan = $itemUnit->loans()->where('status', 'Disewa')->exists();
            if ($hasActiveLoan) {
                return redirect()->back()->with('error', 'Unit ini sedang disewa dan tidak dapat diubah.');
            }
        }

        // Validation: Check if unit has active broken item reports
        if (in_array($itemUnit->status, ['Rusak', 'Dalam Perbaikan'])) {
            $hasActiveReport = $itemUnit->brokenItemReports()
                ->whereIn('status', ['reported', 'in_repair'])
                ->exists();

            if ($hasActiveReport) {
                return redirect()->back()->with('error', 'Unit ini memiliki laporan kerusakan aktif dan tidak dapat diubah.');
            }
        }

        $oldStatus = $itemUnit->status;
        $oldCode = $itemUnit->kode_unit;

        $validatedData = $request->validate([
            'id_barang' => 'required|exists:items,id',
            'kode_unit' => 'required|string|max:255|regex:/^[A-Z0-9\-]+$/|unique:item_units,kode_unit,' . $itemUnit->id,
            'status' => 'required|in:Tersedia,Tidak Tersedia,Rusak,Dalam Perbaikan,Disewa,Sedang Ditahan',
        ]);

        try {
            DB::beginTransaction();

            $itemUnit->update($validatedData);

            DB::commit();

            // Send notification AFTER successful update
            $this->sendItemUnitUpdatedNotification($itemUnit, $oldStatus, $oldCode);

            return redirect()->route('item-units.index')->with('success', 'Unit berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui unit: ' . $e->getMessage()]);
        }
    }

    public function destroy(ItemUnit $itemUnit)
    {
        // Validation: Check if unit is currently being used (has active loans)
        if ($itemUnit->status === 'Disewa') {
            $hasActiveLoan = $itemUnit->loans()->where('status', 'Disewa')->exists();
            if ($hasActiveLoan) {
                return redirect()->route('item-units.index')
                    ->with('error', 'Unit ini sedang disewa dan tidak dapat dihapus.');
            }
        }

        // Validation: Check if unit has active broken item reports
        if (in_array($itemUnit->status, ['Rusak', 'Dalam Perbaikan'])) {
            $hasActiveReport = $itemUnit->brokenItemReports()
                ->whereIn('status', ['reported', 'in_repair'])
                ->exists();

            if ($hasActiveReport) {
                return redirect()->route('item-units.index')
                    ->with('error', 'Unit ini memiliki laporan kerusakan aktif dan tidak dapat dihapus.');
            }
        }

        // Note: We allow deletion of units with historical loans/reports,
        // but prevent deletion of units with active/current issues

        try {
            DB::beginTransaction();

            // Store data for notification before deletion
            $unitData = [
                'id' => $itemUnit->id,
                'kode_unit' => $itemUnit->kode_unit,
                'item_name' => $itemUnit->item->nama_barang,
                'status' => $itemUnit->status
            ];

            $itemUnit->delete();

            DB::commit();

            // Send notification AFTER successful deletion
            $this->sendItemUnitDeletedNotification($unitData);

            return redirect()->route('item-units.index')->with('success', 'Unit berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus unit: ' . $e->getMessage()]);
        }
    }

    private function sendItemUnitCreatedNotification(ItemUnit $itemUnit)
    {
        try {
            $message = "<b>🔧 UNIT BARU DITAMBAHKAN</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL UNIT:</b>\n";
            $message .= "• ID Unit: <code>#{$itemUnit->id}</code>\n";
            $message .= "• Kode Unit: <code>{$itemUnit->kode_unit}</code>\n";
            $message .= "• Nama Barang: <b>{$itemUnit->item->nama_barang}</b>\n";
            $message .= "• Status: <b>{$itemUnit->status}</b>\n\n";

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕒 <i>Ditambahkan: " . $itemUnit->created_at->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send item unit created notification: ' . $e->getMessage());
        }
    }

    private function sendItemUnitUpdatedNotification(ItemUnit $itemUnit, string $oldStatus, string $oldCode)
    {
        try {
            $message = "<b>🔄 UNIT DIPERBARUI</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL UNIT:</b>\n";
            $message .= "• ID Unit: <code>#{$itemUnit->id}</code>\n";
            $message .= "• Nama Barang: <b>{$itemUnit->item->nama_barang}</b>\n\n";

            if ($oldCode !== $itemUnit->kode_unit) {
                $message .= "<b>🔄 PERUBAHAN KODE:</b>\n";
                $message .= "• Kode Sebelumnya: <code>{$oldCode}</code>\n";
                $message .= "• Kode Terbaru: <code>{$itemUnit->kode_unit}</code>\n\n";
            } else {
                $message .= "<b>📝 KODE UNIT:</b> <code>{$itemUnit->kode_unit}</code>\n\n";
            }

            if ($oldStatus !== $itemUnit->status) {
                $message .= "<b>🔄 PERUBAHAN STATUS:</b>\n";
                $message .= "• Status Sebelumnya: <i>{$oldStatus}</i>\n";
                $message .= "• Status Terbaru: <b>{$itemUnit->status}</b>\n\n";
            } else {
                $message .= "<b>📊 STATUS:</b> <b>{$itemUnit->status}</b>\n\n";
            }

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕒 <i>Diperbarui: " . now()->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send item unit updated notification: ' . $e->getMessage());
        }
    }

    private function sendItemUnitDeletedNotification(array $unitData)
    {
        try {
            $message = "<b>🗑️ UNIT DIHAPUS</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL UNIT:</b>\n";
            $message .= "• ID Unit: <code>#{$unitData['id']}</code>\n";
            $message .= "• Kode Unit: <code>{$unitData['kode_unit']}</code>\n";
            $message .= "• Nama Barang: <b>{$unitData['item_name']}</b>\n";
            $message .= "• Status Terakhir: <b>{$unitData['status']}</b>\n\n";

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕒 <i>Dihapus: " . now()->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send item unit deleted notification: ' . $e->getMessage());
        }
    }
}