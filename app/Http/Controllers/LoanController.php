<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
class LoanController extends Controller
{
    /**
     * Display a listing of the loans.
     */
    public function index()
    {
        $loans = Loan::with('item')->get()->map(function ($loan) {
            return [
                'id' => $loan->id,
                'nama_penyewa' => $loan->nama_penyewa,
                'no_tlp_penyewa' => $loan->no_tlp_penyewa,
                'tanggal_sewa' => $loan->tanggal_sewa,
                'tanggal_kembali' => $loan->tanggal_kembali,
                'deadline_pengembalian' => $loan->deadline_pengembalian,
                'status' => $loan->status,
                'nama_barang' => $loan->item ? $loan->item->nama_barang : 'Barang Tidak Tersedia',
                'id_barang' => $loan->id_barang,
            ];
        });

        $items = Item::where('status', 'Tersedia')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nama_barang' => $item->nama_barang,
                'jumlah' => $item->jumlah,
            ];
        });

        return Inertia::render('loan/loan-index', [
            'loans' => $loans,
            'items' => $items,
        ]);
    }

    /**
     * Store a newly created loan.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama_penyewa' => 'required|string|max:255',
            'no_tlp_penyewa' => 'required|string|max:20',
            'id_barang' => 'required|exists:items,id',
            'tanggal_sewa' => 'required|date',
            'deadline_pengembalian' => 'required|date|after:tanggal_sewa',
        ]);

        // Check item availability
        $item = Item::findOrFail($validatedData['id_barang']);
        if ($item->status !== 'Tersedia' || $item->jumlah <= 0) {
            return back()->withErrors(['id_barang' => 'Barang tidak tersedia untuk disewa']);
        }

        // Reduce item quantity
        $item->decrement('jumlah');
        $item->save();

        // Update item status if no more items available
        if ($item->jumlah <= 0) {
            $item->update(['status' => 'Tidak Tersedia']);
        }

        // Create loan
        $loan = Loan::create([
            'nama_penyewa' => $validatedData['nama_penyewa'],
            'no_tlp_penyewa' => $validatedData['no_tlp_penyewa'],
            'id_barang' => $validatedData['id_barang'],
            'tanggal_sewa' => $validatedData['tanggal_sewa'],
            'deadline_pengembalian' => $validatedData['deadline_pengembalian'],
            'status' => 'Disewa',
            'tanggal_kembali' => null,
        ]);

        return redirect()->route('loans.index')->with('success', 'Penyewaan berhasil ditambahkan.');
    }
}
