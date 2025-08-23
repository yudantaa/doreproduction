<?php

namespace App\Http\Controllers;

use App\Models\{Item, Category, Loan, ItemUnit};
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    public function index()
    {
        // Get items with their available units count
        $items = Item::with(['category'])
            ->get()
            ->map(function ($item) {
                $availableUnits = $item->itemUnits()->where('status', 'Tersedia')->count();

                return [
                    'id' => $item->id,
                    'nama_barang' => $item->nama_barang,
                    'jumlah' => $availableUnits,
                    'status' => $availableUnits > 0 ? 'Tersedia' : 'Tidak Tersedia',
                    'deskripsi' => $item->deskripsi,
                    'id_kategori' => $item->id_kategori,
                    'nama_kategori' => $item->category->nama_kategori ?? 'Tidak Ada Kategori',
                    'image' => $item->image
                ];
            });

        // Get featured items (available items with most units)
        $featuredItems = $items->filter(function ($item) {
            return $item['status'] === 'Tersedia';
        })->sortByDesc('jumlah')->take(6)->values();

        return inertia('homepage', [
            'items' => $items,
            'categories' => Category::all(),
            'featuredItems' => $featuredItems,
            'isAuthenticated' => auth()->check() && auth()->user()->role,
        ]);
    }

    public function peralatan()
    {
        // Get only available items with their unit count
        $items = Item::with(['category'])
            ->get()
            ->map(function ($item) {
                $availableUnits = $item->itemUnits()->where('status', 'Tersedia')->count();

                return [
                    'id' => $item->id,
                    'nama_barang' => $item->nama_barang,
                    'jumlah' => $availableUnits,
                    'status' => $availableUnits > 0 ? 'Tersedia' : 'Tidak Tersedia',
                    'deskripsi' => $item->deskripsi,
                    'id_kategori' => $item->id_kategori,
                    'nama_kategori' => $item->category->nama_kategori ?? 'Tidak Ada Kategori',
                    'image' => $item->image
                ];
            })
            ->filter(function ($item) {
                return $item['status'] === 'Tersedia';
            })
            ->values();

        return inertia('all-items', [
            'items' => $items,
            'categories' => Category::all(),
            'isAuthenticated' => auth()->check() && auth()->user()->role,
        ]);
    }
}
