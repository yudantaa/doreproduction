<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BrokenItemReport;
use App\Models\Category;
use App\Models\Item;
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
        $totalAvailable = Item::where('status', 'Tersedia')->sum('jumlah');
        $totalUnavailable = Item::where('status', 'Tidak Tersedia')->sum('jumlah');
        $totalOnHold = Item::where('status', 'Sedang Ditahan')->sum('jumlah');

        return Inertia::render('item/item-index', [
            'items' => Item::with('category')->get()->map(fn($item) => [
                'id' => $item->id,
                'nama_barang' => $item->nama_barang,
                'jumlah' => $item->jumlah,
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
            'totalUnavailable' => $totalUnavailable
        ]);
    }

    /**
     * Store a newly created item.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama_barang' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:0',
            'status' => 'required|in:Tersedia,Tidak Tersedia,Sedang Ditahan',
            'deskripsi' => 'nullable|string',
            'id_kategori' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,webp|max:5120' // 5MB max
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('items', 'public');
            $validatedData['image'] = $imagePath;
        }

        $item = Item::create($validatedData);

        return redirect()->route('items.index')->with('success', 'Item created successfully.');
    }

    /**
     * Update the specified item.
     */
    public function update(Request $request, Item $item)
    {
        // Check if item has active broken reports
        $hasActiveReports = BrokenItemReport::where('item_id', $item->id)
            ->whereIn('status', ['reported', 'repair_requested', 'in_repair'])
            ->exists();

        if ($hasActiveReports || $item->status === 'Sedang Ditahan') {
            return back()->with('error', 'Item ini sedang dalam proses diperbaiki/ditahan dan tidak dapat diubah');
        }

        $validatedData = $request->validate([
            'nama_barang' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:0',
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

        $item->update($validatedData);

        return redirect()->route('items.index')->with('success', 'Item updated successfully.');
    }

    public function destroy(Item $item)
    {
        $hasReports = BrokenItemReport::where('item_id', $item->id)->exists();

        if ($hasReports) {
            return redirect()->route('items.index')
                ->with('error', 'Item ini memiliki laporan kerusakan dan tidak dapat dihapus');
        }

        if ($item->image && Storage::disk('public')->exists($item->image)) {
            Storage::disk('public')->delete($item->image);
        }

        $item->delete();

        return redirect()->route('items.index')->with('success', 'Item deleted successfully.');
    }
}