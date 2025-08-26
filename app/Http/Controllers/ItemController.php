<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BrokenItemReport;
use App\Models\Category;
use App\Models\Item;
use App\Models\ItemUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Storage;
use Illuminate\Support\Facades\Validator;

class ItemController extends Controller
{
    public function index()
    {
        $totalAvailable = ItemUnit::where('status', 'Tersedia')->count();
        $totalUnavailable = ItemUnit::whereIn('status', ['Tidak Tersedia', 'Rusak', 'Dalam Perbaikan', 'Sedang Ditahan'])->count();
        $totalRented = ItemUnit::where('status', 'Disewa')->count();

        return Inertia::render('item/item-index', [
            'items' => Item::with(['category', 'itemUnits'])->get()->map(fn($item) => [
                'id' => $item->id,
                'nama_barang' => $item->nama_barang,
                'base_code' => $item->base_code,
                'total_units' => $item->itemUnits->count(),
                'available_units' => $item->itemUnits->where('status', 'Tersedia')->count(),
                'rented_units' => $item->itemUnits->where('status', 'Disewa')->count(),
                'broken_units' => $item->itemUnits->whereIn('status', ['Rusak', 'Dalam Perbaikan'])->count(),
                'held_units' => $item->itemUnits->where('status', 'Sedang Ditahan')->count(),
                'status' => $item->status,
                'deskripsi' => $item->deskripsi,
                'created_at' => $item->created_at->format('Y-m-d H:i:s'),
                'id_kategori' => $item->category?->id,
                'nama_kategori' => $item->category?->nama_kategori ?? 'Tidak Ada Kategori',
                'image' => $item->image
            ]),
            'categories' => Category::all()->map(fn($category) => [
                'id' => $category->id,
                'nama_kategori' => $category->nama_kategori,
            ]),
            'totalAvailable' => $totalAvailable,
            'totalUnavailable' => $totalUnavailable,
            'totalRented' => $totalRented
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama_barang' => 'required|string|max:255',
            'base_code' => 'required|string|max:10|regex:/^[A-Z0-9\-]+$/|unique:items,base_code',
            'initial_units' => 'required|integer|min:1|max:100',
            'status' => 'required|in:Tersedia,Tidak Tersedia,Sedang Ditahan',
            'deskripsi' => 'nullable|string|max:1000',
            'id_kategori' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,webp|max:2048',
        ]);

        try {
            DB::beginTransaction();

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('items', 'public');
                $validatedData['image'] = $imagePath;
            }

            $item = Item::create($validatedData);

            // Create initial units
            for ($i = 1; $i <= $validatedData['initial_units']; $i++) {
                ItemUnit::create([
                    'id_barang' => $item->id,
                    'kode_unit' => $validatedData['base_code'] . '-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                    'status' => $validatedData['status'] === 'Tersedia' ? 'Tersedia' :
                        ($validatedData['status'] === 'Sedang Ditahan' ? 'Sedang Ditahan' : 'Tidak Tersedia')
                ]);
            }

            DB::commit();

            // Send notification AFTER successful creation
            $this->sendItemCreatedNotification($item, $validatedData['initial_units']);

            return redirect()->route('items.index')->with('success', 'Item dan unit berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();

            if (isset($imagePath) && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat membuat item: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, Item $item)
    {
        // Validation: Check for active broken item reports
        $hasActiveReports = BrokenItemReport::whereHas('itemUnit', function ($query) use ($item) {
            $query->where('id_barang', $item->id);
        })
            ->whereIn('status', ['reported', 'repair_requested', 'in_repair'])
            ->exists();

        if ($hasActiveReports) {
            return back()->with('error', 'Item ini memiliki laporan kerusakan aktif dan tidak dapat diubah');
        }

        // Validation: Check for active loans
        $hasActiveLoans = $item->itemUnits()->whereHas('loans', function ($query) {
            $query->where('status', 'Disewa');
        })->exists();

        if ($hasActiveLoans) {
            return back()->with('error', 'Item ini memiliki unit yang sedang disewa dan tidak dapat diubah');
        }

        $validator = Validator::make($request->all(), [
            'nama_barang' => 'required|string|max:255',
            'base_code' => 'sometimes|string|max:10|regex:/^[A-Z0-9\-]+$/|unique:items,base_code,' . $item->id,
            'additional_units' => 'sometimes|integer|min:0|max:50',
            'status' => 'required|in:Tersedia,Tidak Tersedia,Sedang Ditahan',
            'deskripsi' => 'nullable|string|max:1000',
            'id_kategori' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,webp|max:2048'
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $validatedData = $validator->validated();

        try {
            DB::beginTransaction();

            $oldStatus = $item->status;
            $oldImagePath = $item->image;

            if ($request->hasFile('image')) {
                // Validate image file
                if (!$request->file('image')->isValid()) {
                    throw new \Exception('File gambar tidak valid');
                }

                if ($item->image && Storage::disk('public')->exists($item->image)) {
                    Storage::disk('public')->delete($item->image);
                }
                $imagePath = $request->file('image')->store('items', 'public');
                $validatedData['image'] = $imagePath;
            }

            $item->update($validatedData);

            // Add additional units if requested
            $additionalUnitsCreated = 0;
            if (isset($validatedData['additional_units']) && $validatedData['additional_units'] > 0) {
                $baseCode = $validatedData['base_code'] ?? $item->base_code;
                $existingUnitsCount = $item->itemUnits()->count();

                for ($i = 1; $i <= $validatedData['additional_units']; $i++) {
                    $unitNumber = $existingUnitsCount + $i;
                    ItemUnit::create([
                        'id_barang' => $item->id,
                        'kode_unit' => $baseCode . '-' . str_pad($unitNumber, 3, '0', STR_PAD_LEFT),
                        'status' => $validatedData['status'] === 'Tersedia' ? 'Tersedia' :
                            ($validatedData['status'] === 'Sedang Ditahan' ? 'Sedang Ditahan' : 'Tidak Tersedia')
                    ]);
                }
                $additionalUnitsCreated = $validatedData['additional_units'];
            }

            // Update unit statuses if item status changed
            if ($oldStatus !== $validatedData['status']) {
                $this->updateItemUnitsStatus($item, $oldStatus, $validatedData['status']);
            }

            DB::commit();

            // Send notification AFTER successful update
            $this->sendItemUpdatedNotification($item, $oldStatus, $additionalUnitsCreated);

            return redirect()->route('items.index')->with('success', 'Item berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();

            if (isset($imagePath) && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui item: ' . $e->getMessage()]);
        }
    }

    private function updateItemUnitsStatus(Item $item, string $oldStatus, string $newStatus)
    {
        if ($newStatus === 'Sedang Ditahan') {
            $item->itemUnits()
                ->where('status', 'Tersedia')
                ->update(['status' => 'Sedang Ditahan']);

        } elseif ($oldStatus === 'Sedang Ditahan' && $newStatus === 'Tersedia') {
            $item->itemUnits()
                ->where('status', 'Sedang Ditahan')
                ->update(['status' => 'Tersedia']);

        } elseif ($newStatus === 'Tidak Tersedia') {
            $item->itemUnits()
                ->where('status', 'Tersedia')
                ->update(['status' => 'Tidak Tersedia']);

        } elseif ($oldStatus === 'Tidak Tersedia' && $newStatus === 'Tersedia') {
            $item->itemUnits()
                ->where('status', 'Tidak Tersedia')
                ->update(['status' => 'Tersedia']);
        }
    }

    public function destroy(Item $item)
    {
        // Validation: Check if item has units
        $hasUnits = $item->itemUnits()->exists();
        if ($hasUnits) {
            return redirect()->route('items.index')
                ->with('error', 'Item ini memiliki unit yang terdaftar dan tidak dapat dihapus. Hapus semua unit terlebih dahulu.');
        }

        // Validation: Check if item has broken item reports
        $hasReports = BrokenItemReport::whereHas('itemUnit', function ($query) use ($item) {
            $query->where('id_barang', $item->id);
        })->exists();

        if ($hasReports) {
            return redirect()->route('items.index')
                ->with('error', 'Item ini memiliki laporan kerusakan dan tidak dapat dihapus');
        }

        try {
            DB::beginTransaction();

            // Store data for notification before deletion
            $itemData = [
                'id' => $item->id,
                'nama_barang' => $item->nama_barang,
                'base_code' => $item->base_code,
                'category_name' => $item->category->nama_kategori ?? 'Tidak Ada Kategori'
            ];

            if ($item->image && Storage::disk('public')->exists($item->image)) {
                Storage::disk('public')->delete($item->image);
            }

            $item->delete();

            DB::commit();

            // Send notification AFTER successful deletion
            $this->sendItemDeletedNotification($itemData);

            return redirect()->route('items.index')->with('success', 'Item berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus item: ' . $e->getMessage()]);
        }
    }

    private function sendItemCreatedNotification(Item $item, int $initialUnits)
    {
        try {
            $message = "<b>📦 BARANG BARU DITAMBAHKAN</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL BARANG:</b>\n";
            $message .= "• ID: <code>#{$item->id}</code>\n";
            $message .= "• Nama Barang: <b>{$item->nama_barang}</b>\n";
            $message .= "• Kode Base: <code>{$item->base_code}</code>\n";
            $message .= "• Kategori: <b>{$item->category->nama_kategori}</b>\n";
            $message .= "• Status: <b>{$item->status}</b>\n\n";

            $message .= "<b>📊 UNIT AWAL:</b>\n";
            $message .= "• Jumlah Unit: <b>{$initialUnits} unit</b>\n\n";

            if ($item->deskripsi) {
                $message .= "<b>📝 DESKRIPSI:</b>\n";
                $message .= "<i><code>{$item->deskripsi}</code></i>\n\n";
            }

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕒 <i>Dibuat: " . $item->created_at->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send item created notification: ' . $e->getMessage());
        }
    }

    private function sendItemUpdatedNotification(Item $item, string $oldStatus, int $additionalUnits = 0)
    {
        try {
            $message = "<b>🔄 BARANG DIPERBARUI</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL BARANG:</b>\n";
            $message .= "• ID: <code>#{$item->id}</code>\n";
            $message .= "• Nama Barang: <b>{$item->nama_barang}</b>\n";
            $message .= "• Kode Base: <code>{$item->base_code}</code>\n";
            $message .= "• Kategori: <b>{$item->category->nama_kategori}</b>\n\n";

            if ($oldStatus !== $item->status) {
                $message .= "<b>🔄 PERUBAHAN STATUS:</b>\n";
                $message .= "• Status Sebelumnya: <i>{$oldStatus}</i>\n";
                $message .= "• Status Terbaru: <b>{$item->status}</b>\n\n";
            } else {
                $message .= "<b>📊 STATUS:</b> <b>{$item->status}</b>\n\n";
            }

            if ($additionalUnits > 0) {
                $message .= "<b>➕ UNIT TAMBAHAN:</b>\n";
                $message .= "• Ditambahkan: <b>{$additionalUnits} unit baru</b>\n\n";
            }

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕒 <i>Diperbarui: " . now()->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send item updated notification: ' . $e->getMessage());
        }
    }

    private function sendItemDeletedNotification(array $itemData)
    {
        try {
            $message = "<b>🗑️ BARANG DIHAPUS</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL BARANG:</b>\n";
            $message .= "• ID: <code>#{$itemData['id']}</code>\n";
            $message .= "• Nama Barang: <b>{$itemData['nama_barang']}</b>\n";
            $message .= "• Kode Base: <code>{$itemData['base_code']}</code>\n";
            $message .= "• Kategori: <b>{$itemData['category_name']}</b>\n\n";

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕒 <i>Dihapus: " . now()->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send item deleted notification: ' . $e->getMessage());
        }
    }
}
