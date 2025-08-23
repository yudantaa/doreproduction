<?php

namespace App\Http\Controllers;

use App\Models\BrokenItemReport;
use App\Models\Item;
use App\Models\ItemUnit;
use App\Models\User;
use App\Notifications\BrokenItemReported;
use App\Notifications\BrokenItemStatusUpdated;
use App\Notifications\RepairRequested;
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

                // Item Unit data
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

                // For backward compatibility - direct item access
                'item' => [
                    'id' => $report->itemUnit->item->id,
                    'nama_barang' => $report->itemUnit->item->nama_barang,
                    'image' => $report->itemUnit->item->image,
                ],

                // Reporter data
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

            // Item Unit data
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

            // For backward compatibility
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
        // If specific item unit is requested
        $selectedItemUnit = null;
        if ($request->has('unit_id')) {
            $selectedItemUnit = ItemUnit::with('item')
                ->where('id', $request->unit_id)
                ->where('status', 'Tersedia')
                ->first();
        }

        // Get all available item units grouped by item
        $itemsWithUnits = Item::with(['itemUnits' => function ($query) {
            $query->where('status', 'Tersedia')->orderBy('kode_unit');
        }])
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
            'proof_image' => 'nullable|image|max:5120',
        ]);

        $itemUnit = ItemUnit::with('item')->findOrFail($validated['id_item_unit']);

        // Check if unit is available for reporting
        if (!in_array($itemUnit->status, ['Tersedia', 'Disewa'])) {
            return redirect()
                ->back()
                ->withErrors(['id_item_unit' => 'Unit ini tidak dapat dilaporkan rusak dalam status saat ini.']);
        }

        // Check if already reported
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

            // Handle image upload
            $imagePath = null;
            if ($request->hasFile('proof_image')) {
                $imagePath = $request->file('proof_image')->store('broken-items-proofs', 'public');
            }

            // Create broken item report
            $report = BrokenItemReport::create([
                'id_item_unit' => $validated['id_item_unit'],
                'reporter_id' => Auth::id(),
                'description' => $validated['description'],
                'proof_image_path' => $imagePath,
                'status' => 'reported',
            ]);

            // Update item unit status
            $itemUnit->update(['status' => 'Rusak']);

            // If the unit was being rented, handle loan cancellation
            $activeLoan = $itemUnit->loans()->where('status', 'Disewa')->first();
            if ($activeLoan) {
                $activeLoan->update([
                    'status' => 'Dibatalkan',
                    'tanggal_kembali' => now(),
                ]);
            }

            DB::commit();

            // Send notifications
            $superAdmins = User::where('role', 'SUPER ADMIN')->get();
            foreach ($superAdmins as $admin) {
                $admin->notify(new BrokenItemReported($report));
            }

            return redirect()
                ->route('dashboard.broken-items.index')
                ->with('success', 'Laporan barang rusak berhasil dibuat. Unit ' . $itemUnit->kode_unit . ' telah ditandai sebagai rusak.');

        } catch (\Exception $e) {
            DB::rollBack();

            // Delete uploaded image if transaction fails
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
        // This method handles status updates from the show page
        $validated = $request->validate([
            'status' => 'required|in:in_repair,repaired,rejected',
        ]);

        try {
            DB::beginTransaction();

            $oldStatus = $report->status;
            $newStatus = $validated['status'];

            $report->update([
                'status' => $newStatus,
                'repair_notes' => $request->input('notes', $report->repair_notes),
            ]);

            $itemUnit = $report->itemUnit;

            // Update item unit status based on report status
            switch ($newStatus) {
                case 'in_repair':
                    $itemUnit->update(['status' => 'Dalam Perbaikan']);
                    break;

                case 'repaired':
                    $itemUnit->update(['status' => 'Tersedia']);
                    break;

                case 'rejected':
                    // If rejected, restore to original status (or available if unknown)
                    $itemUnit->update(['status' => 'Tersedia']);
                    break;
            }

            DB::commit();

            // Send notification
            if ($report->reporter) {
                $report->reporter->notify(new BrokenItemStatusUpdated($report));
            }

            return redirect()->back()->with('success', 'Status laporan berhasil diperbarui.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui status: ' . $e->getMessage()]);
        }
    }

    public function destroy(BrokenItemReport $report)
    {
        // Only SUPER ADMIN can delete reports
        if (auth()->user()->role !== 'SUPER ADMIN') {
            abort(403);
        }

        try {
            DB::beginTransaction();

            // If report is not resolved, restore item unit status
            if (!in_array($report->status, ['repaired', 'rejected'])) {
                $report->itemUnit->update(['status' => 'Tersedia']);
            }

            // Delete proof image if exists
            if ($report->proof_image_path && Storage::disk('public')->exists($report->proof_image_path)) {
                Storage::disk('public')->delete($report->proof_image_path);
            }

            $report->delete();

            DB::commit();

            return redirect()->route('dashboard.broken-items.index')
                ->with('success', 'Laporan berhasil dihapus.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus laporan: ' . $e->getMessage()]);
        }
    }
}
