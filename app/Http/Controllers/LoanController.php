<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ItemUnit;
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

        // Ambil semua data peminjaman dengan relasi itemUnit dan item
        $loans = Loan::with(['itemUnit.item'])->get()->map(function ($loan) {
            return [
                'id' => $loan->id,
                'nama_penyewa' => $loan->nama_penyewa,
                'no_tlp_penyewa' => $loan->no_tlp_penyewa,
                'tanggal_sewa' => $loan->tanggal_sewa,
                'tanggal_kembali' => $loan->tanggal_kembali,
                'deadline_pengembalian' => $loan->deadline_pengembalian,
                'status' => $loan->status,
                'kode_unit' => $loan->itemUnit ? $loan->itemUnit->kode_unit : 'Unit Tidak Tersedia',
                'nama_barang' => $loan->itemUnit && $loan->itemUnit->item ? $loan->itemUnit->item->nama_barang : 'Barang Tidak Tersedia',
                'id_item_unit' => $loan->id_item_unit,
            ];
        });

        // Ambil data items yang memiliki unit tersedia
        $items = Item::whereHas('itemUnits', function ($query) {
            $query->where('status', 'Tersedia');
        })->with([
                    'itemUnits' => function ($query) {
                        $query->where('status', 'Tersedia');
                    }
                ])->get()->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'nama_barang' => $item->nama_barang,
                        'available_units' => $item->itemUnits->count(),
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
        $validatedData = $request->validate([
            'nama_penyewa' => 'required|string|max:255',
            'no_tlp_penyewa' => 'required|string|max:20',
            'id_barang' => 'required|exists:items,id',
            'tanggal_sewa' => 'required|date',
            'deadline_pengembalian' => 'required|date|after:tanggal_sewa',
        ]);

        // Cari unit yang tersedia untuk barang ini
        $availableUnit = ItemUnit::where('id_barang', $validatedData['id_barang'])
            ->where('status', 'Tersedia')
            ->first();

        if (!$availableUnit) {
            return back()->withErrors(['id_barang' => 'Tidak ada unit barang yang tersedia untuk disewa']);
        }

        // Update status unit menjadi disewa
        $availableUnit->update(['status' => 'Disewa']);

        // Buat data peminjaman baru
        $loan = Loan::create([
            'nama_penyewa' => $validatedData['nama_penyewa'],
            'no_tlp_penyewa' => $validatedData['no_tlp_penyewa'],
            'id_item_unit' => $availableUnit->id,
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
            if ($loan->itemUnit->id_barang !== $validatedData['id_barang']) {
                // Cari unit tersedia untuk barang baru
                $newAvailableUnit = ItemUnit::where('id_barang', $validatedData['id_barang'])
                    ->where('status', 'Tersedia')
                    ->first();

                if (!$newAvailableUnit) {
                    throw ValidationException::withMessages([
                        'id_barang' => 'Tidak ada unit tersedia untuk barang yang dipilih'
                    ]);
                }

                // Kembalikan unit lama ke status tersedia
                $loan->itemUnit->update(['status' => 'Tersedia']);

                // Update unit baru menjadi disewa
                $newAvailableUnit->update(['status' => 'Disewa']);

                // Update id_item_unit di loan
                $validatedData['id_item_unit'] = $newAvailableUnit->id;
            }

            // Update data peminjaman
            $loan->update([
                'nama_penyewa' => $validatedData['nama_penyewa'],
                'no_tlp_penyewa' => $validatedData['no_tlp_penyewa'],
                'id_item_unit' => $validatedData['id_item_unit'] ?? $loan->id_item_unit,
                'tanggal_sewa' => $validatedData['tanggal_sewa'],
                'deadline_pengembalian' => $validatedData['deadline_pengembalian'],
            ]);

            DB::commit();
            return redirect()->route('loans.index')->with('success', 'Peminjaman berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui peminjaman: ' . $e->getMessage()]);
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

            // Parse waktu pengembalian
            $returnTime = Carbon::parse($validated['return_time']);

            // Validasi waktu pengembalian tidak boleh sebelum tanggal sewa
            if ($returnTime < $loan->tanggal_sewa) {
                throw ValidationException::withMessages([
                    'return_time' => 'Waktu pengembalian tidak boleh sebelum tanggal sewa'
                ]);
            }

            // Update status unit kembali ke tersedia
            $loan->itemUnit->update(['status' => 'Tersedia']);

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

            // Update status unit kembali ke tersedia
            $loan->itemUnit->update(['status' => 'Tersedia']);

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

            // Jika peminjaman masih aktif, kembalikan unit ke tersedia
            if ($loan->status === 'Disewa') {
                $loan->itemUnit->update(['status' => 'Tersedia']);
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
        // Get frequently rented item IDs based on item units
        $frequentItemIds = Loan::join('item_units', 'loans.id_item_unit', '=', 'item_units.id')
            ->select('item_units.id_barang', DB::raw('COUNT(*) as rental_count'))
            ->groupBy('item_units.id_barang')
            ->orderBy('rental_count', 'DESC')
            ->limit(6)
            ->pluck('item_units.id_barang');

        return Item::with('category')
            ->whereIn('id', $frequentItemIds)
            ->whereHas('itemUnits', function ($query) {
                $query->where('status', 'Tersedia');
            })
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_barang' => $item->nama_barang,
                    'available_units' => $item->itemUnits->where('status', 'Tersedia')->count(),
                    'status' => $item->status,
                    'deskripsi' => $item->deskripsi,
                    'id_kategori' => $item->id_kategori,
                    'nama_kategori' => $item->category->nama_kategori ?? 'Tidak Ada Kategori',
                    'image' => $item->image
                ];
            });
    }
}