<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class LoanController extends Controller
{
    /**
     * Display a listing of the loans.
     */
    public function index()
    {
        return Inertia::render('loan/loan-index', [
            'loans' => Loan::with('item')->get()->map(fn ($loan) => [
                'id' => $loan->id,
                'nama_penyewa' => $loan->nama_penyewa,
                'no_tlp_penyewa' => $loan->no_tlp_penyewa,
                'tanggal_sewa' => $loan->tanggal_sewa,
                'tanggal_kembali' => $loan->tanggal_kembali,
                'deadline_pengembalian' => $loan->deadline_pengembalian,
                'status' => $loan->status,
                'nama_barang' => $loan->item?->nama_barang ?? 'Barang Tidak Tersedia',
                'id_barang' => $loan->id_barang,
            ]),
            'items' => Item::where('status', 'Tersedia')->get()->map(fn ($item) => [
                'id' => $item->id,
                'nama_barang' => $item->nama_barang,
                'jumlah' => $item->jumlah,
            ]),
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
            'status' => 'Dipinjam',
            'tanggal_kembali' => null,
        ]);

        return redirect()->route('loans.index')->with('success', 'Peminjaman berhasil ditambahkan.');
    }

    /**
     * Return an item (update loan status and item availability)
     */
    public function returnItem(Request $request, Loan $loan)
    {
        // Check if loan is already returned
        if ($loan->status === 'Dikembalikan') {
            return back()->withErrors(['error' => 'Barang sudah dikembalikan sebelumnya']);
        }

        // Update item quantity
        $item = $loan->item;
        $item->increment('jumlah');
        $item->update(['status' => 'Tersedia']);

        // Update loan status
        $loan->update([
            'status' => 'Dikembalikan',
            'tanggal_kembali' => now(),
        ]);

        return redirect()->route('loans.index')->with('success', 'Barang berhasil dikembalikan');
    }

    /**
     * Cancel a loan before item is returned
     */
    public function cancel(Loan $loan)
    {
        // Check if loan is already returned or cancelled
        if ($loan->status !== 'Dipinjam') {
            return back()->withErrors(['error' => 'Peminjaman tidak dapat dibatalkan']);
        }

        // Return item to inventory
        $item = $loan->item;
        $item->increment('jumlah');
        $item->update(['status' => 'Tersedia']);

        // Cancel loan
        $loan->update([
            'status' => 'Dibatalkan',
            'tanggal_kembali' => now(),
        ]);

        return redirect()->route('loans.index')->with('success', 'Peminjaman berhasil dibatalkan');
    }

    /**
     * Delete a loan record
     */
    public function destroy(Loan $loan)
    {
        // Only allow deletion of cancelled or returned loans
        if (!in_array($loan->status, ['Dikembalikan', 'Dibatalkan'])) {
            return back()->withErrors(['error' => 'Hanya loan yang sudah dikembalikan atau dibatalkan yang dapat dihapus']);
        }

        $loan->delete();

        return redirect()->route('loans.index')->with('success', 'Catatan peminjaman berhasil dihapus');
    }
}
