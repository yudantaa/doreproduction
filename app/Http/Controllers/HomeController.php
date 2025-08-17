<?php

namespace App\Http\Controllers;

use App\Models\{Item, Category, Loan};
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    public function index()
    {
        $frequentItemIds = Loan::select('id_barang', DB::raw('COUNT(*) as rental_count'))
            ->groupBy('id_barang')
            ->orderBy('rental_count', 'DESC')
            ->limit(6)
            ->pluck('id_barang');

        $featuredItems = Item::with('category')
            ->whereIn('id', $frequentItemIds)
            ->where('status', 'Tersedia')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_barang' => $item->nama_barang,
                    'jumlah' => $item->jumlah,
                    'status' => $item->status,
                    'deskripsi' => $item->deskripsi,
                    'id_kategori' => $item->id_kategori,
                    'nama_kategori' => $item->category->nama_kategori ?? 'Tidak Ada Kategori',
                    'image' => $item->image
                ];
            });

        return inertia('homepage', [
            'items' => Item::all(),
            'categories' => Category::all(),
            'featuredItems' => $featuredItems,
            'isAuthenticated' => auth()->check() && auth()->user()->role,
        ]);
    }
    public function peralatan()
    {
        return inertia('all-items', [
            'items' => Item::where('status', 'Tersedia')->get(),
            'categories' => Category::all(),
            'isAuthenticated' => auth()->check() && auth()->user()->role,
        ]);
    }
}