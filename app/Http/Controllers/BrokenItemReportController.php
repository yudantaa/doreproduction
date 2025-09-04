<?php

namespace App\Http\Controllers;

use App\Models\BrokenItemReport;
use App\Models\Item;
use App\Models\ItemUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Storage;

class BrokenItemReportController extends Controller
{
    public function index(Request $request)
    {
        $query = BrokenItemReport::with([
            'itemUnit.item',
            'reporter'
        ])->latest();

        if ($request->has('search') && $request->search) {
            $query->whereHas('itemUnit.item', function ($q) use ($request) {
                $q->where('nama_barang', 'like', '%' . $request->search . '%');
            })->orWhereHas('itemUnit', function ($q) use ($request) {
                $q->where('kode_unit', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $reports = $query->get()->map(function ($report) {
            return [
                'id' => $report->id,
                'id_item_unit' => $report->id_item_unit,
                'description' => $report->description,
                'proof_image_path' => $report->proof_image_path,
                'status' => $report->status,
                'repair_notes' => $report->repair_notes,
                'created_at' => $report->created_at,
                'updated_at' => $report->updated_at,
                'itemUnit' => [
                    'id' => $report->itemUnit->id,
                    'kode_unit' => $report->itemUnit->kode_unit,
                    'status' => $report->itemUnit->status,
                    'item' => [
                        'id' => $report->itemUnit->item->id,
                        'nama_barang' => $report->itemUnit->item->nama_barang,
                        'image' => $report->itemUnit->item->image,
                    ]
                ],
                'item' => [
                    'id' => $report->itemUnit->item->id,
                    'nama_barang' => $report->itemUnit->item->nama_barang,
                    'image' => $report->itemUnit->item->image,
                ],
                'reporter' => [
                    'id' => $report->reporter->id,
                    'name' => $report->reporter->name,
                    'email' => $report->reporter->email,
                ],
            ];
        });

        return Inertia::render('broken-items/broken-item-index', [
            'reports' => $reports,
        ]);
    }

    public function show(BrokenItemReport $report)
    {
        $report->load(['itemUnit.item', 'reporter']);

        $formattedReport = [
            'id' => $report->id,
            'id_item_unit' => $report->id_item_unit,
            'description' => $report->description,
            'proof_image_path' => $report->proof_image_path,
            'status' => $report->status,
            'repair_notes' => $report->repair_notes,
            'created_at' => $report->created_at,
            'updated_at' => $report->updated_at,
            'itemUnit' => [
                'id' => $report->itemUnit->id,
                'kode_unit' => $report->itemUnit->kode_unit,
                'status' => $report->itemUnit->status,
                'item' => [
                    'id' => $report->itemUnit->item->id,
                    'nama_barang' => $report->itemUnit->item->nama_barang,
                    'image' => $report->itemUnit->item->image,
                ]
            ],
            'item' => [
                'id' => $report->itemUnit->item->id,
                'nama_barang' => $report->itemUnit->item->nama_barang,
                'image' => $report->itemUnit->item->image,
            ],
            'reporter' => [
                'id' => $report->reporter->id,
                'name' => $report->reporter->name,
                'email' => $report->reporter->email,
            ],
        ];

        return Inertia::render('broken-items/show-broken-item', [
            'report' => $formattedReport,
            'canUpdateStatus' => auth()->user()->role === 'SUPER ADMIN',
        ]);
    }

    public function create(Request $request)
    {
        $selectedItemUnit = null;
        if ($request->has('unit_id')) {
            $selectedItemUnit = ItemUnit::with('item')
                ->where('id', $request->unit_id)
                ->where('status', 'Tersedia')
                ->first();
        }

        $itemsWithUnits = Item::with([
            'itemUnits' => function ($query) {
                $query->where('status', 'Tersedia')->orderBy('kode_unit');
            }
        ])
            ->whereHas('itemUnits', function ($query) {
                $query->where('status', 'Tersedia');
            })
            ->orderBy('nama_barang')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_barang' => $item->nama_barang,
                    'image' => $item->image,
                    'units' => $item->itemUnits->map(function ($unit) {
                        return [
                            'id' => $unit->id,
                            'kode_unit' => $unit->kode_unit,
                            'status' => $unit->status,
                        ];
                    })
                ];
            });

        return Inertia::render('broken-items/create-form', [
            'itemsWithUnits' => $itemsWithUnits,
            'selectedItemUnit' => $selectedItemUnit ? [
                'id' => $selectedItemUnit->id,
                'kode_unit' => $selectedItemUnit->kode_unit,
                'item' => [
                    'id' => $selectedItemUnit->item->id,
                    'nama_barang' => $selectedItemUnit->item->nama_barang,
                ]
            ] : null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_item_unit' => 'required|exists:item_units,id',
            'description' => 'required|string|max:1000',
            'proof_image' => 'nullable|image|mimes:jpeg,png,webp|max:2048',
        ]);

        $itemUnit = ItemUnit::with('item')->findOrFail($validated['id_item_unit']);

        if (!in_array($itemUnit->status, ['Tersedia', 'Disewa'])) {
            return redirect()
                ->back()
                ->withErrors(['id_item_unit' => 'Unit ini tidak dapat dilaporkan rusak dalam status saat ini.']);
        }

        $existingReport = BrokenItemReport::where('id_item_unit', $validated['id_item_unit'])
            ->whereIn('status', ['reported', 'in_repair'])
            ->first();

        if ($existingReport) {
            return redirect()
                ->back()
                ->withErrors(['id_item_unit' => 'Unit ini sudah dilaporkan rusak sebelumnya.']);
        }

        try {
            DB::beginTransaction();

            $imagePath = null;
            if ($request->hasFile('proof_image')) {
                $imagePath = $request->file('proof_image')->store('broken-items-proofs', 'public');
            }

            $report = BrokenItemReport::create([
                'id_item_unit' => $validated['id_item_unit'],
                'id_pelapor' => Auth::id(),
                'description' => $validated['description'],
                'proof_image_path' => $imagePath,
                'status' => 'reported',
            ]);

            $itemUnit->update(['status' => 'Rusak']);

            $activeLoan = $itemUnit->loans()->where('status', 'Disewa')->first();
            if ($activeLoan) {
                $activeLoan->update([
                    'status' => 'Dibatalkan',
                    'tanggal_kembali' => now(),
                ]);
            }

            DB::commit();

            // Send notification AFTER successful transaction
            $this->sendBrokenItemReportNotification($report);

            return redirect()
                ->route('dashboard.broken-items.index')
                ->with('success', 'Laporan barang rusak berhasil dibuat. Unit ' . $itemUnit->kode_unit . ' telah ditandai sebagai rusak.');

        } catch (\Exception $e) {
            DB::rollBack();

            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            return redirect()
                ->back()
                ->withErrors(['error' => 'Terjadi kesalahan saat membuat laporan: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, BrokenItemReport $report)
    {
        $validated = $request->validate([
            'status' => 'required|in:in_repair,repaired,rejected',
            'notes' => 'nullable|string|max:1000'
        ]);

        try {
            DB::beginTransaction();

            $oldStatus = $report->status;
            $newStatus = $validated['status'];

            $report->update([
                'status' => $newStatus,
                'repair_notes' => $validated['notes'] ?? $report->repair_notes,
            ]);

            $itemUnit = $report->itemUnit;

            switch ($newStatus) {
                case 'in_repair':
                    $itemUnit->update(['status' => 'Dalam Perbaikan']);
                    break;

                case 'repaired':
                    $itemUnit->update(['status' => 'Tersedia']);
                    break;

                case 'rejected':
                    $itemUnit->update(['status' => 'Tersedia']);
                    break;
            }

            DB::commit();

            // Send notification AFTER successful transaction
            $this->sendBrokenItemStatusNotification($report, $oldStatus);

            return redirect()->back()->with('success', 'Status laporan berhasil diperbarui.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui status: ' . $e->getMessage()]);
        }
    }

    /**
     * Update repair notes only - New method for inline editing
     */
    public function updateNotes(Request $request, BrokenItemReport $report)
    {
        // Only allow SUPER ADMIN to update notes
        if (auth()->user()->role !== 'SUPER ADMIN') {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'repair_notes' => 'nullable|string|max:1000'
        ]);

        try {
            $oldNotes = $report->repair_notes;

            $report->update([
                'repair_notes' => $validated['repair_notes']
            ]);

            // Send notification if notes were updated
            $this->sendRepairNotesUpdateNotification($report, $oldNotes);

            return redirect()->back()->with('success', 'Catatan perbaikan berhasil diperbarui.');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['repair_notes' => 'Terjadi kesalahan saat memperbarui catatan: ' . $e->getMessage()]);
        }
    }

    public function destroy(BrokenItemReport $report)
    {
        if (auth()->user()->role !== 'SUPER ADMIN') {
            abort(403);
        }

        try {
            DB::beginTransaction();

            if (!in_array($report->status, ['repaired', 'rejected'])) {
                $report->itemUnit->update(['status' => 'Tersedia']);
            }

            if ($report->proof_image_path && Storage::disk('public')->exists($report->proof_image_path)) {
                Storage::disk('public')->delete($report->proof_image_path);
            }

            // Store data for notification before deletion
            $reportData = [
                'id' => $report->id,
                'item_name' => $report->itemUnit->item->nama_barang,
                'unit_code' => $report->itemUnit->kode_unit,
                'reporter_name' => $report->reporter->name,
                'status' => $report->status
            ];

            $report->delete();

            DB::commit();

            // Send notification AFTER successful deletion
            $this->sendBrokenItemDeleteNotification($reportData);

            return redirect()->route('dashboard.broken-items.index')
                ->with('success', 'Laporan berhasil dihapus.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus laporan: ' . $e->getMessage()]);
        }
    }

    private function sendRepairNotesUpdateNotification(BrokenItemReport $report, $oldNotes)
    {
        try {
            $report->load(['itemUnit.item', 'reporter']);

            $message = "<b>📝 UPDATE CATATAN PERBAIKAN</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL LAPORAN:</b>\n";
            $message .= "• ID Laporan: <code>#{$report->id}</code>\n";
            $message .= "• Nama Barang: <b>{$report->itemUnit->item->nama_barang}</b>\n";
            $message .= "• Kode Unit: <code>{$report->itemUnit->kode_unit}</code>\n\n";

            if ($oldNotes) {
                $message .= "<b>📝 CATATAN SEBELUMNYA:</b>\n";
                $message .= "<i><code>" . (strlen($oldNotes) > 100 ? substr($oldNotes, 0, 100) . '...' : $oldNotes) . "</code></i>\n\n";
            }

            if ($report->repair_notes) {
                $message .= "<b>📝 CATATAN TERBARU:</b>\n";
                $message .= "<i><code>" . (strlen($report->repair_notes) > 100 ? substr($report->repair_notes, 0, 100) . '...' : $report->repair_notes) . "</code></i>\n\n";
            } else {
                $message .= "<b>📝 CATATAN TERBARU:</b>\n";
                $message .= "<i>Catatan dihapus</i>\n\n";
            }

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕐 <i>Diperbarui: " . now()->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send repair notes update notification: ' . $e->getMessage());
        }
    }

    private function sendBrokenItemReportNotification(BrokenItemReport $report)
    {
        try {
            $report->load(['itemUnit.item', 'reporter']);

            $message = "<b>🚨 LAPORAN KERUSAKAN BARANG</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL LAPORAN:</b>\n";
            $message .= "• ID Laporan: <code>#{$report->id}</code>\n";
            $message .= "• Nama Barang: <b>{$report->itemUnit->item->nama_barang}</b>\n";
            $message .= "• Kode Unit: <code>{$report->itemUnit->kode_unit}</code>\n";
            $message .= "• Status: <b>Dilaporkan Rusak</b>\n\n";

            $message .= "<b>👤 PELAPOR:</b>\n";
            $message .= "• Nama: <b>{$report->reporter->name}</b>\n";
            $message .= "• Email: <code>{$report->reporter->email}</code>\n\n";

            $message .= "<b>📝 DESKRIPSI KERUSAKAN:</b>\n";
            $message .= "<i><code>{$report->description}</code></i>\n\n";

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕐 <i>Dilaporkan: " . $report->created_at->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send broken item notification: ' . $e->getMessage());
        }
    }

    private function sendBrokenItemStatusNotification(BrokenItemReport $report, string $oldStatus)
    {
        try {
            $report->load(['itemUnit.item', 'reporter']);

            $statusLabels = [
                'reported' => '📋 Dilaporkan',
                'in_repair' => '🔧 Dalam Perbaikan',
                'repaired' => '✅ Sudah Diperbaiki',
                'rejected' => '❌ Ditolak'
            ];

            $statusIcons = [
                'reported' => '📋',
                'in_repair' => '🔧',
                'repaired' => '✅',
                'rejected' => '❌'
            ];

            $message = "<b>📄 UPDATE STATUS LAPORAN</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL LAPORAN:</b>\n";
            $message .= "• ID Laporan: <code>#{$report->id}</code>\n";
            $message .= "• Nama Barang: <b>{$report->itemUnit->item->nama_barang}</b>\n";
            $message .= "• Kode Unit: <code>{$report->itemUnit->kode_unit}</code>\n\n";

            $message .= "<b>📄 PERUBAHAN STATUS:</b>\n";
            $message .= "• Status Sebelumnya: {$statusLabels[$oldStatus]}\n";
            $message .= "• Status Terbaru: <b>{$statusLabels[$report->status]}</b>\n\n";

            if ($report->repair_notes) {
                $message .= "<b>📝 CATATAN PERBAIKAN:</b>\n";
                $message .= "<i> <code>{$report->repair_notes}</code></i>\n\n";
            }

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕐 <i>Diperbarui: " . now()->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send status update notification: ' . $e->getMessage());
        }
    }

    private function sendBrokenItemDeleteNotification(array $reportData)
    {
        try {
            $statusLabels = [
                'reported' => '📋 Dilaporkan',
                'in_repair' => '🔧 Dalam Perbaikan',
                'repaired' => '✅ Sudah Diperbaiki',
                'rejected' => '❌ Ditolak'
            ];

            $message = "<b>🗑️ LAPORAN DIHAPUS</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL LAPORAN:</b>\n";
            $message .= "• ID Laporan: <code>#{$reportData['id']}</code>\n";
            $message .= "• Nama Barang: <b>{$reportData['item_name']}</b>\n";
            $message .= "• Kode Unit: <code>{$reportData['unit_code']}</code>\n";
            $message .= "• Pelapor: <b>{$reportData['reporter_name']}</b>\n";
            $message .= "• Status Terakhir: {$statusLabels[$reportData['status']]}\n\n";

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕐 <i>Dihapus: " . now()->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send delete notification: ' . $e->getMessage());
        }
    }
}
