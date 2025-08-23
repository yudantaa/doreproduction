<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BrokenItemReport;
use App\Models\Category;
use App\Models\Item;
use App\Models\ItemUnit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Storage;

class ItemController extends Controller
{
    /**
     * Display a listing of the items.
     */
    public function index()
    {
        $totalAvailable = ItemUnit::where('status', 'Tersedia')->count();
        $totalUnavailable = ItemUnit::whereIn('status', ['Tidak Tersedia', 'Rusak', 'Dalam Perbaikan'])->count();
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

    /**
     * Store a newly created item.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama_barang' => 'required|string|max:255',
            'base_code' => 'required|string|max:10',
            'initial_units' => 'required|integer|min:1',
            'status' => 'required|in:Tersedia,Tidak Tersedia,Sedang Ditahan',
            'deskripsi' => 'nullable|string',
            'id_kategori' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,webp|max:5120',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('items', 'public');
            $validatedData['image'] = $imagePath;
        }

        // Create the item
        $item = Item::create($validatedData);

        // Create initial units with sequential codes
        for ($i = 1; $i <= $validatedData['initial_units']; $i++) {
            ItemUnit::create([
                'id_barang' => $item->id,
                'kode_unit' => $validatedData['base_code'] . '-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'status' => $item->status === 'Tersedia' ? 'Tersedia' : 'Tidak Tersedia'
            ]);
        }

        return redirect()->route('items.index')->with('success', 'Item dan unit berhasil dibuat.');
    }

    /**
     * Update the specified item.
     */
    public function update(Request $request, Item $item)
    {
        // Check if item has active broken reports
        $hasActiveReports = BrokenItemReport::whereHas('itemUnit', function ($query) use ($item) {
            $query->where('id_barang', $item->id);
        })
            ->whereIn('status', ['reported', 'repair_requested', 'in_repair'])
            ->exists();

        if ($hasActiveReports) {
            return back()->with('error', 'Item ini memiliki laporan kerusakan aktif dan tidak dapat diubah');
        }

        $validatedData = $request->validate([
            'nama_barang' => 'required|string|max:255',
            'base_code' => 'sometimes|string|max:10',
            'additional_units' => 'sometimes|integer|min:0',
            'status' => 'required|in:Tersedia,Tidak Tersedia,Sedang Ditahan',
            'deskripsi' => 'nullable|string',
            'id_kategori' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,webp|max:5120'
        ]);

        // Handle image upload/update
        if ($request->hasFile('image')) {
            if ($item->image && Storage::disk('public')->exists($item->image)) {
                Storage::disk('public')->delete($item->image);
            }
            $imagePath = $request->file('image')->store('items', 'public');
            $validatedData['image'] = $imagePath;
        }

        $oldStatus = $item->status;

        // Update the item
        $item->update($validatedData);

        // Create additional units if requested
        if (isset($validatedData['additional_units']) && $validatedData['additional_units'] > 0) {
            $baseCode = $validatedData['base_code'] ?? $item->base_code;
            $existingUnitsCount = $item->itemUnits()->count();

            for ($i = 1; $i <= $validatedData['additional_units']; $i++) {
                $unitNumber = $existingUnitsCount + $i;
                ItemUnit::create([
                    'id_barang' => $item->id,
                    'kode_unit' => $baseCode . '-' . str_pad($unitNumber, 3, '0', STR_PAD_LEFT),
                    'status' => $item->status === 'Tersedia' ? 'Tersedia' : 'Tidak Tersedia'
                ]);
            }
        }

        // Update all related ItemUnits based on new status
        if ($oldStatus !== $validatedData['status']) {
            $this->updateItemUnitsStatus($item, $oldStatus, $validatedData['status']);
        }

        return redirect()->route('items.index')->with('success', 'Item berhasil diperbarui.');
    }

    /**
     * Update ItemUnits status when Item status changes
     */
    private function updateItemUnitsStatus(Item $item, string $oldStatus, string $newStatus)
    {
        if ($newStatus === 'Sedang Ditahan') {
            // When item is put on hold, all available units become unavailable
            // But don't change units that are rented, broken, or in repair
            $item->itemUnits()
                ->where('status', 'Tersedia')
                ->update(['status' => 'Tidak Tersedia']);

        } elseif ($oldStatus === 'Sedang Ditahan' && $newStatus === 'Tersedia') {
            // When item is released from hold, unavailable units become available
            // But only those that were made unavailable due to the hold
            $item->itemUnits()
                ->where('status', 'Tidak Tersedia')
                ->update(['status' => 'Tersedia']);

        } elseif ($newStatus === 'Tidak Tersedia') {
            // When item becomes unavailable, all available units become unavailable
            $item->itemUnits()
                ->where('status', 'Tersedia')
                ->update(['status' => 'Tidak Tersedia']);

        } elseif ($oldStatus === 'Tidak Tersedia' && $newStatus === 'Tersedia') {
            // When item becomes available, unavailable units become available
            $item->itemUnits()
                ->where('status', 'Tidak Tersedia')
                ->update(['status' => 'Tersedia']);
        }
    }

    public function destroy(Item $item)
    {
        // Check if item has any units
        $hasUnits = $item->itemUnits()->exists();
        if ($hasUnits) {
            return redirect()->route('items.index')
                ->with('error', 'Item ini memiliki unit yang terdaftar dan tidak dapat dihapus. Hapus semua unit terlebih dahulu.');
        }

        // Check if item has broken reports
        $hasReports = BrokenItemReport::whereHas('itemUnit', function ($query) use ($item) {
            $query->where('id_barang', $item->id);
        })->exists();

        if ($hasReports) {
            return redirect()->route('items.index')
                ->with('error', 'Item ini memiliki laporan kerusakan dan tidak dapat dihapus');
        }

        if ($item->image && Storage::disk('public')->exists($item->image)) {
            Storage::disk('public')->delete($item->image);
        }

        $item->delete();

        return redirect()->route('items.index')->with('success', 'Item berhasil dihapus.');
    }
}
