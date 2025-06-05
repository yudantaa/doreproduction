<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
class LoanController extends Controller
{
    /**
     * Display a listing of the loans.
     */
    public function index()
    {
        $totalActiveLoans = Loan::where('status', 'Disewa')->count();
        $totalOverdue = Loan::where('status', 'Disewa')
            ->where('deadline_pengembalian', '<', now())
            ->count();

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
            'totalActiveLoans' => $totalActiveLoans,
            'totalOverdue' => $totalOverdue,
        ]);
    }

    public function getMonthlyStatistics()
    {
        $currentYear = Carbon::now()->year;

        // Get loans created per month
        $monthlyLoans = Loan::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as total_loans'),
            DB::raw('SUM(CASE WHEN status = "Disewa" THEN 1 ELSE 0 END) as active_loans'),
            DB::raw('SUM(CASE WHEN status = "Dikembalikan" THEN 1 ELSE 0 END) as returned_loans'),
            DB::raw('SUM(CASE WHEN status = "Dibatalkan" THEN 1 ELSE 0 END) as cancelled_loans'),
            DB::raw('SUM(CASE WHEN deadline_pengembalian < NOW() AND status = "Disewa" THEN 1 ELSE 0 END) as overdue_loans')
        )
            ->whereYear('created_at', $currentYear)
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->orderBy('month')
            ->get();

        // Format data for the chart
        $formattedData = [];
        $monthNames = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember'
        ];

        foreach ($monthlyLoans as $data) {
            $formattedData[] = [
                'bulan' => $monthNames[$data->month],
                'total' => $data->total_loans,
                'aktif' => $data->active_loans,
                'dikembalikan' => $data->returned_loans,
                'dibatalkan' => $data->cancelled_loans,
                'terlambat' => $data->overdue_loans
            ];
        }

        return $formattedData;
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
    public function update(Request $request, Loan $loan)
    {
        try {
            DB::beginTransaction();

            // Validate request data
            $validatedData = $request->validate([
                'nama_penyewa' => 'required|string|max:255',
                'no_tlp_penyewa' => 'required|string|max:20',
                'id_barang' => 'required|exists:items,id',
                'tanggal_sewa' => 'required|date',
                'deadline_pengembalian' => 'required|date|after:tanggal_sewa',
            ]);

            // If item is being changed
            if ($loan->id_barang !== $validatedData['id_barang']) {
                // Check new item availability
                $newItem = Item::findOrFail($validatedData['id_barang']);
                if ($newItem->status !== 'Tersedia' && $newItem->jumlah <= 0) {
                    throw ValidationException::withMessages([
                        'id_barang' => 'Barang baru tidak tersedia untuk disewa'
                    ]);
                }

                // Return the old item's quantity
                $oldItem = Item::findOrFail($loan->id_barang);
                $oldItem->increment('jumlah');
                if ($oldItem->status === 'Tidak Tersedia' && $oldItem->jumlah > 0) {
                    $oldItem->update(['status' => 'Tersedia']);
                }

                // Decrease new item's quantity
                $newItem->decrement('jumlah');
                if ($newItem->jumlah <= 0) {
                    $newItem->update(['status' => 'Tidak Tersedia']);
                }
            }

            // Update loan
            $loan->update($validatedData);

            DB::commit();
            return redirect()->route('loans.index')->with('success', 'Peminjaman berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui peminjaman.']);
        }
    }

    /**
     * Mark a loan as returned.
     */
    public function return(Loan $loan)
    {
        try {
            DB::beginTransaction();

            // Ensure loan is still active
            if ($loan->status !== 'Disewa') {
                throw ValidationException::withMessages([
                    'status' => 'Peminjaman ini tidak dalam status disewa'
                ]);
            }

            // Update item quantity and status
            $item = Item::findOrFail($loan->id_barang);
            $item->increment('jumlah');
            if ($item->status === 'Tidak Tersedia') {
                $item->update(['status' => 'Tersedia']);
            }

            // Update loan status
            $loan->update([
                'status' => 'Dikembalikan',
                'tanggal_kembali' => now(),
            ]);

            DB::commit();
            return redirect()->route('loans.index')->with('success', 'Barang berhasil dikembalikan.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat mengembalikan barang.']);
        }
    }

    /**
     * Cancel a loan.
     */
    public function cancel(Loan $loan)
    {
        try {
            DB::beginTransaction();

            // Ensure loan is still active
            if ($loan->status !== 'Disewa') {
                throw ValidationException::withMessages([
                    'status' => 'Peminjaman ini tidak dalam status disewa'
                ]);
            }

            // Update item quantity and status
            $item = Item::findOrFail($loan->id_barang);
            $item->increment('jumlah');
            if ($item->status === 'Tidak Tersedia') {
                $item->update(['status' => 'Tersedia']);
            }

            // Update loan status
            $loan->update([
                'status' => 'Dibatalkan',
                'tanggal_kembali' => now(),
            ]);

            DB::commit();
            return redirect()->route('loans.index')->with('success', 'Peminjaman berhasil dibatalkan.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat membatalkan peminjaman.']);
        }
    }
}