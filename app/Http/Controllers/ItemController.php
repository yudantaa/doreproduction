<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Inertia\Inertia;

class ItemController extends Controller
{
    /**
     * Display a listing of the items.
     */
    public function index()
    {
        return Inertia::render('item/item-index', [
            'items' => Item::all()->map(fn ($item) => [
                'id' => $item->id,
                'nama_barang' => $item->nama_barang,
                'jumlah' => $item->jumlah,
                'status' => $item->status,
                'deskripsi' => $item->deskripsi,
                'created_at' => $item->created_at->format('Y-m-d H:i:s'),
                'id_kategori' => $item->category->id ?? null,
            ])
        ]);
    }

    // /**
    //  * Show the form for creating a new item.
    //  */
    // public function create()
    // {
    //     return Inertia::render('item/item-create');
    // }

    // /**
    //  * Store a newly created item in storage.
    //  */
    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|email|unique:items,email',
    //         'password' => 'required|string|min:8|confirmed',
    //         'role' => 'nullable|string|max:255',
    //     ]);

    //     Item::create([
    //         'name' => $validated['name'],
    //         'email' => $validated['email'],
    //         'password' => Hash::make($validated['password']),
    //         'role' => $validated['role'] ?? 'ADMIN',
    //     ]);

    //     return redirect()->route('items.index')->with('success', 'item created successfully.');
    // }

    // /**
    //  * Show the form for editing the specified item.
    //  */
    // public function edit(item $item)
    // {
    //     return Inertia::render('item/item-edit', [
    //         'item' => [
    //             'id' => $item->id,
    //             'name' => $item->name,
    //             'email' => $item->email,
    //             'role' => $item->role,
    //         ]
    //     ]);
    // }

    // /**
    //  * Update the specified item in storage.
    //  */
    // public function update(Request $request, item $item)
    // {
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => "required|email|unique:items,email,{$item->id}",
    //         // 'password' => 'nullable|string|min:8|confirmed',
    //         'role' => 'nullable|string|max:255',
    //     ]);

    //     $item->update([
    //         'name' => $validated['name'],
    //         'email' => $validated['email'],
    //         // 'password' => $validated['password'] ? Hash::make($validated['password']) : $item->password,
    //         'role' => $validated['role'] ?? $item->role,
    //     ]);

    //     return redirect()->route('items.index')->with('success', 'item updated successfully.');
    // }

    /**
     * Remove the specified item from storage.
     */
    public function destroy(item $item)
    {
        $item->delete();

        return redirect()->route('items.index')->with('success', 'item deleted successfully.');
    }
}
