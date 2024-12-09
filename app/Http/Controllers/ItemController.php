<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
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
        return Inertia::render('item/item-index', [
            'items' => Item::with('category')->get()->map(fn ($item) => [
                'id' => $item->id,
                'nama_barang' => $item->nama_barang,
                'jumlah' => $item->jumlah,
                'status' => $item->status,
                'deskripsi' => $item->deskripsi,
                'created_at' => $item->created_at->format('Y-m-d H:i:s'),
                'id_kategori' => $item->category?->id,
                'nama_kategori' => $item->category?->nama_kategori ?? 'Tidak Ada Kategori',
            ]),
            'categories' => Category::all()->map(fn ($category) => [
                'id' => $category->id,
                'nama_kategori' => $category->nama_kategori,
            ]),
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
            'status' => 'required|in:Tersedia,Tidak Tersedia',
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
        $validatedData = $request->validate([
            'nama_barang' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:0',
            'status' => 'required|in:Tersedia,Tidak Tersedia',
            'deskripsi' => 'nullable|string',
            'id_kategori' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,webp|max:5120' // 5MB max
        ]);

        // Handle image upload/update
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($item->image) {
                Storage::disk('public')->delete($item->image);
            }

            // Store new image
            $imagePath = $request->file('image')->store('items', 'public');
            $validatedData['image'] = $imagePath;


        }

        $item->update($validatedData);

        return redirect()->route('items.index')->with('success', 'Item updated successfully.');
    }

    /**
     * Remove the specified item.
     */
    public function destroy(Item $item)
    {
        $item->delete();

        return redirect()->route('items.index')->with('success', 'Item deleted successfully.');
    }
}
