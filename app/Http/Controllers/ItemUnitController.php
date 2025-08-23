<?php

namespace App\Http\Controllers;

use App\Models\ItemUnit;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemUnitController extends Controller
{
    /**
     * Display a listing of the item units.
     */
    public function index()
    {
        return Inertia::render('item-unit/item-unit-index', [
            'itemUnits' => ItemUnit::with('item')->get(),
            'items' => Item::all()->map(fn($item) => [
                'id' => $item->id,
                'nama_barang' => $item->nama_barang,
            ]),
        ]);
    }

    /**
     * Store a newly created item unit.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'id_barang' => 'required|exists:items,id',
            'kode_unit' => 'required|string|max:255|unique:item_units,kode_unit',
            'status' => 'required|in:Tersedia,Tidak Tersedia,Rusak,Dalam Perbaikan,Disewa',
        ]);

        ItemUnit::create($validatedData);

        return redirect()->route('item-units.index')->with('success', 'Unit berhasil ditambahkan.');
    }

    /**
     * Update the specified item unit.
     */
    public function update(Request $request, ItemUnit $itemUnit)
    {
        $validatedData = $request->validate([
            'id_barang' => 'required|exists:items,id',
            'kode_unit' => 'required|string|max:255|unique:item_units,kode_unit,' . $itemUnit->id,
            'status' => 'required|in:Tersedia,Tidak Tersedia,Rusak,Dalam Perbaikan,Disewa',
        ]);

        $itemUnit->update($validatedData);

        return redirect()->route('item-units.index')->with('success', 'Unit berhasil diperbarui.');
    }

    /**
     * Remove the specified item unit.
     */
    public function destroy(ItemUnit $itemUnit)
    {
        $itemUnit->delete();

        return redirect()->route('item-units.index')->with('success', 'Unit berhasil dihapus.');
    }
}