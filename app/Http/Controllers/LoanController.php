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
     * Menampilkan daftar semua peminjaman
     */
    public function index()
    {
        // Hitung total peminjaman aktif
        $totalActiveLoans = Loan::where('status', 'Disewa')->count();

        // Hitung total peminjaman yang melebihi deadline
        $totalOverdue = Loan::where('status', 'Disewa')
            ->where('deadline_pengembalian', '<', now())
            ->count();

        // Ambil semua data peminjaman dengan relasi item
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

        // Ambil data barang yang tersedia
        $items = Item::where('status', 'Tersedia')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nama_barang' => $item->nama_barang,
                'jumlah' => $item->jumlah,
            ];
        });

        // Kirim data ke view Inertia
        return Inertia::render('loan/loan-index', [
            'loans' => $loans,
            'items' => $items,
            'totalActiveLoans' => $totalActiveLoans,
            'totalOverdue' => $totalOverdue,
            'isSuperAdmin' => auth()->user()->role === 'SUPER ADMIN',
        ]);
    }

    /**
     * Mengambil statistik peminjaman bulanan
     */
    public function getMonthlyStatistics()
    {
        // Ambil range tahun dari data peminjaman
        $yearsRange = Loan::select(
            DB::raw('MIN(YEAR(created_at)) as min_year'),
            DB::raw('MAX(YEAR(created_at)) as max_year')
        )->first();

        $minYear = $yearsRange->min_year ?? date('Y');
        $maxYear = $yearsRange->max_year ?? date('Y');

        // Ambil data peminjaman per bulan
        $monthlyLoans = Loan::select(
            DB::raw('YEAR(created_at) as year'),
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as total_loans'),
            DB::raw('SUM(CASE WHEN status = "Disewa" THEN 1 ELSE 0 END) as active_loans'),
            DB::raw('SUM(CASE WHEN status = "Dikembalikan" THEN 1 ELSE 0 END) as returned_loans'),
            DB::raw('SUM(CASE WHEN status = "Dibatalkan" THEN 1 ELSE 0 END) as cancelled_loans'),
            DB::raw('SUM(CASE WHEN deadline_pengembalian < tanggal_kembali AND status = "Dikembalikan" THEN 1 ELSE 0 END) as terlambat_dikembalikan')
        )
            ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'))
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->keyBy(function ($item) {
                return $item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT);
            });


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

        $formattedData = [];

        // Format data untuk semua bulan dalam range
        for ($year = $minYear; $year <= $maxYear; $year++) {
            foreach ($monthNames as $monthNum => $monthName) {
                $key = $year . '-' . str_pad($monthNum, 2, '0', STR_PAD_LEFT);
                $loanData = $monthlyLoans->get($key);

                $formattedData[] = [
                    'bulan' => $monthName . ' ' . $year,
                    'total' => (int) ($loanData ? $loanData->total_loans : 0),
                    'aktif' => (int) ($loanData ? $loanData->active_loans : 0),
                    'dikembalikan' => (int) ($loanData ? $loanData->returned_loans : 0),
                    'dibatalkan' => (int) ($loanData ? $loanData->cancelled_loans : 0),
                    'terlambat' => (int) ($loanData ? $loanData->terlambat_dikembalikan : 0),
                ];
            }
        }


        return $formattedData;
    }

    /**
     * Menyimpan peminjaman baru
     */
    public function store(Request $request)
    {
        // Validasi input
        $validatedData = $request->validate([
            'nama_penyewa' => 'required|string|max:255',
            'no_tlp_penyewa' => 'required|string|max:20',
            'id_barang' => 'required|exists:items,id',
            'tanggal_sewa' => 'required|date',
            'deadline_pengembalian' => 'required|date|after:tanggal_sewa',
        ]);

        // Cek ketersediaan barang
        $item = Item::findOrFail($validatedData['id_barang']);
        if ($item->status !== 'Tersedia' || $item->jumlah <= 0) {
            return back()->withErrors(['id_barang' => 'Barang tidak tersedia untuk disewa']);
        }

        // Kurangi stok barang
        $item->decrement('jumlah');
        $item->save();

        // Update status barang jika stok habis
        if ($item->jumlah <= 0) {
            $item->update(['status' => 'Tidak Tersedia']);
        }

        // Buat data peminjaman baru
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

    /**
     * Memperbarui data peminjaman
     */
    public function update(Request $request, Loan $loan)
    {
        try {
            DB::beginTransaction();

            // Validasi input
            $validatedData = $request->validate([
                'nama_penyewa' => 'required|string|max:255',
                'no_tlp_penyewa' => 'required|string|max:20',
                'id_barang' => 'required|exists:items,id',
                'tanggal_sewa' => 'required|date',
                'deadline_pengembalian' => 'required|date|after:tanggal_sewa',
            ]);

            // Jika barang diubah
            if ($loan->id_barang !== $validatedData['id_barang']) {
                // Cek ketersediaan barang baru
                $newItem = Item::findOrFail($validatedData['id_barang']);
                if ($newItem->jumlah <= 0) {
                    throw ValidationException::withMessages([
                        'id_barang' => 'Barang baru tidak tersedia untuk disewa'
                    ]);
                }

                // Kembalikan stok barang lama
                $oldItem = Item::findOrFail($loan->id_barang);
                $oldItem->increment('jumlah');
                if ($oldItem->status === 'Tidak Tersedia' && $oldItem->jumlah > 0) {
                    $oldItem->update(['status' => 'Tersedia']);
                }

                // Kurangi stok barang baru
                $newItem->decrement('jumlah');
                if ($newItem->jumlah <= 0) {
                    $newItem->update(['status' => 'Tidak Tersedia']);
                }
            }

            // Update data peminjaman
            $loan->update($validatedData);

            DB::commit();
            return redirect()->route('loans.index')->with('success', 'Peminjaman berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui peminjaman.']);
        }
    }

    /**
     * Menandai peminjaman sebagai dikembalikan
     */
    public function return(Loan $loan, Request $request)
    {
        try {
            DB::beginTransaction();

            // Validasi input
            $validated = $request->validate([
                'return_time' => 'required|date'
            ]);

            // Pastikan status peminjaman masih aktif
            if ($loan->status !== 'Disewa') {
                throw ValidationException::withMessages([
                    'status' => 'Peminjaman ini tidak dalam status disewa'
                ]);
            }

            // Update stok barang
            $item = Item::findOrFail($loan->id_barang);
            $item->increment('jumlah');
            if ($item->status === 'Tidak Tersedia') {
                $item->update(['status' => 'Tersedia']);
            }

            // Parse waktu pengembalian
            $returnTime = Carbon::parse($validated['return_time']);

            // Validasi waktu pengembalian tidak boleh sebelum tanggal sewa
            if ($returnTime < $loan->tanggal_sewa) {
                throw ValidationException::withMessages([
                    'return_time' => 'Waktu pengembalian tidak boleh sebelum tanggal sewa'
                ]);
            }

            // Update status peminjaman
            $loan->update([
                'status' => 'Dikembalikan',
                'tanggal_kembali' => $returnTime,
            ]);

            DB::commit();
            return redirect()->route('loans.index')->with('success', 'Barang berhasil dikembalikan.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Membatalkan peminjaman
     */
    public function cancel(Loan $loan)
    {
        try {
            DB::beginTransaction();

            // Pastikan status peminjaman masih aktif
            if ($loan->status !== 'Disewa') {
                throw ValidationException::withMessages([
                    'status' => 'Peminjaman ini tidak dalam status disewa'
                ]);
            }

            // Update stok barang
            $item = Item::findOrFail($loan->id_barang);
            $item->increment('jumlah');
            if ($item->status === 'Tidak Tersedia') {
                $item->update(['status' => 'Tersedia']);
            }

            // Update status peminjaman
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

    /**
     * Menghapus data peminjaman
     */
    public function destroy(Loan $loan)
    {
        // Only allow SUPER ADMIN to delete loans
        if (auth()->user()->role !== 'SUPER ADMIN') {
            abort(403, 'Unauthorized action.');
        }

        try {
            DB::beginTransaction();

            // Jika peminjaman masih aktif, kembalikan stok barang
            if ($loan->status === 'Disewa') {
                $item = Item::findOrFail($loan->id_barang);
                $item->increment('jumlah');
                if ($item->status === 'Tidak Tersedia' && $item->jumlah > 0) {
                    $item->update(['status' => 'Tersedia']);
                }
            }

            // Hapus data peminjaman
            $loan->delete();

            DB::commit();
            return redirect()->route('loans.index')->with('success', 'Data peminjaman berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus data peminjaman.']);
        }
    }
    public function getFrequentlyRentedItems()
    {
        $frequentItemIds = Loan::select('id_barang', DB::raw('COUNT(*) as rental_count'))
            ->groupBy('id_barang')
            ->orderBy('rental_count', 'DESC')
            ->limit(6)
            ->pluck('id_barang');

        return Item::with('category')
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
    }
}