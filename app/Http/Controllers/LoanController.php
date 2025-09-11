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
    public function index()
    {
        $totalActiveLoans = Loan::where('status', 'Disewa')->count();

        $totalOverdue = Loan::where('status', 'Disewa')
            ->where('deadline_pengembalian', '<', now())
            ->count();

        $loans = Loan::with(['itemUnit.item'])->get()->map(function ($loan) {
            return [
                'id' => $loan->id,
                'nama_penyewa' => $loan->nama_penyewa,
                'no_tlp_penyewa' => $loan->no_tlp_penyewa,
                'tanggal_sewa' => $loan->tanggal_sewa->format('Y-m-d'),
                'tanggal_kembali' => $loan->tanggal_kembali ? $loan->tanggal_kembali->format('Y-m-d H:i:s') : null,
                'deadline_pengembalian' => $loan->deadline_pengembalian->format('Y-m-d'),
                'status' => $loan->status,
                'kode_unit' => $loan->itemUnit ? $loan->itemUnit->kode_unit : 'Unit Tidak Tersedia',
                'nama_barang' => $loan->itemUnit && $loan->itemUnit->item ? $loan->itemUnit->item->nama_barang : 'Barang Tidak Tersedia',
                'id_item_unit' => $loan->id_item_unit,
            ];
        });

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
                        'units' => $item->itemUnits->map(function ($unit) {
                            return [
                                'id' => $unit->id,
                                'kode_unit' => $unit->kode_unit,
                                'status' => $unit->status,
                            ];
                        }),
                    ];
                });

        $availableUnits = ItemUnit::where('status', 'Tersedia')
            ->with('item')
            ->get()
            ->map(function ($unit) {
                return [
                    'id' => $unit->id,
                    'kode_unit' => $unit->kode_unit,
                    'nama_barang' => $unit->item->nama_barang,
                    'item_id' => $unit->item->id,
                ];
            });

        return Inertia::render('loan/loan-index', [
            'loans' => $loans,
            'items' => $items,
            'availableUnits' => $availableUnits,
            'totalActiveLoans' => $totalActiveLoans,
            'totalOverdue' => $totalOverdue,
            'isSuperAdmin' => auth()->user()->role === 'SUPER ADMIN',
        ]);
    }

    public function getMonthlyStatistics()
    {
        $yearsRange = Loan::select(
            DB::raw('MIN(YEAR(created_at)) as min_year'),
            DB::raw('MAX(YEAR(created_at)) as max_year')
        )->first();

        $minYear = $yearsRange->min_year ?? date('Y');
        $maxYear = $yearsRange->max_year ?? date('Y');

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

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama_penyewa' => 'required|string|max:255|regex:/^[a-zA-Z\s.]+$/',
            'no_tlp_penyewa' => 'required|string|max:20|regex:/^[0-9+\-\s()]+$/',
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
            'tanggal_sewa' => 'required|date|after_or_equal:today',
            'deadline_pengembalian' => 'required|date|after:tanggal_sewa|before_or_equal:' . now()->addMonths(3)->format('Y-m-d'),
        ]);

        // Cari unit yang tersedia untuk barang ini
        $availableUnits = ItemUnit::where('id_barang', $validatedData['item_id'])
            ->where('status', 'Tersedia')
            ->limit($validatedData['quantity'])
            ->get();

        if ($availableUnits->count() < $validatedData['quantity']) {
            return back()->withErrors(['quantity' => 'Jumlah unit tidak tersedia. Hanya tersedia ' . $availableUnits->count() . ' unit']);
        }

        try {
            DB::beginTransaction();

            $createdLoans = [];

            foreach ($availableUnits as $unit) {
                $unit->update(['status' => 'Disewa']);

                $loan = Loan::create([
                    'nama_penyewa' => trim($validatedData['nama_penyewa']),
                    'no_tlp_penyewa' => $validatedData['no_tlp_penyewa'],
                    'id_item_unit' => $unit->id,
                    'tanggal_sewa' => $validatedData['tanggal_sewa'],
                    'deadline_pengembalian' => $validatedData['deadline_pengembalian'],
                    'status' => 'Disewa',
                    'tanggal_kembali' => null,
                ]);

                $createdLoans[] = $loan;
            }

            DB::commit();

            // Send single grouped notification for all created loans
            $this->sendGroupedLoanCreatedNotification($createdLoans);

            return redirect()->route('loans.index')->with('success', 'Penyewaan berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat membuat penyewaan: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, Loan $loan)
    {
        if ($loan->status !== 'Disewa') {
            return back()->withErrors(['error' => 'Hanya peminjaman dengan status "Disewa" yang dapat diubah.']);
        }

        $validatedData = $request->validate([
            'nama_penyewa' => 'required|string|max:255|regex:/^[a-zA-Z\s.]+$/',
            'no_tlp_penyewa' => 'required|string|max:20|regex:/^[0-9+\-\s()]+$/',
            'id_item_unit' => 'required|exists:item_units,id',
            'tanggal_sewa' => 'required|date|before_or_equal:today',
            'deadline_pengembalian' => 'required|date|after:tanggal_sewa|before_or_equal:' . now()->addMonths(3)->format('Y-m-d'),
        ]);

        try {
            DB::beginTransaction();

            $oldUnitId = $loan->id_item_unit;
            $oldUnitCode = $loan->itemUnit->kode_unit;

            if ($loan->id_item_unit !== $validatedData['id_item_unit']) {
                $newAvailableUnit = ItemUnit::where('id', $validatedData['id_item_unit'])
                    ->where('status', 'Tersedia')
                    ->first();

                if (!$newAvailableUnit) {
                    throw ValidationException::withMessages([
                        'id_item_unit' => 'Unit barang tidak tersedia'
                    ]);
                }

                $loan->itemUnit->update(['status' => 'Tersedia']);
                $newAvailableUnit->update(['status' => 'Disewa']);
            }

            $loan->update([
                'nama_penyewa' => trim($validatedData['nama_penyewa']),
                'no_tlp_penyewa' => $validatedData['no_tlp_penyewa'],
                'id_item_unit' => $validatedData['id_item_unit'],
                'tanggal_sewa' => $validatedData['tanggal_sewa'],
                'deadline_pengembalian' => $validatedData['deadline_pengembalian'],
            ]);

            DB::commit();

            // Send notification AFTER successful update
            $this->sendLoanUpdatedNotification($loan, $oldUnitId, $oldUnitCode);

            return redirect()->route('loans.index')->with('success', 'Peminjaman berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui peminjaman: ' . $e->getMessage()]);
        }
    }

    public function return(Loan $loan, Request $request)
    {
        $validated = $request->validate([
            'return_time' => 'required|date|before_or_equal:now|after_or_equal:' . $loan->tanggal_sewa->format('Y-m-d')
        ]);

        if ($loan->status !== 'Disewa') {
            throw ValidationException::withMessages([
                'status' => 'Peminjaman ini tidak dalam status disewa'
            ]);
        }

        try {
            DB::beginTransaction();

            $returnTime = Carbon::parse($validated['return_time'], 'UTC')
                ->setTimezone('Asia/Makassar');

            $loan->itemUnit->update(['status' => 'Tersedia']);

            $loan->update([
                'status' => 'Dikembalikan',
                'tanggal_kembali' => $returnTime,
            ]);

            DB::commit();

            // Send notification AFTER successful return
            $this->sendLoanReturnedNotification($loan, $returnTime);

            return redirect()->route('loans.index')->with('success', 'Barang berhasil dikembalikan.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function cancel(Loan $loan)
    {
        if ($loan->status !== 'Disewa') {
            throw ValidationException::withMessages([
                'status' => 'Peminjaman ini tidak dalam status disewa'
            ]);
        }

        try {
            DB::beginTransaction();

            $loan->itemUnit->update(['status' => 'Tersedia']);

            $loan->update([
                'status' => 'Dibatalkan',
                'tanggal_kembali' => now(),
            ]);

            DB::commit();

            // Send notification AFTER successful cancellation
            $this->sendLoanCancelledNotification($loan);

            return redirect()->route('loans.index')->with('success', 'Peminjaman berhasil dibatalkan.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat membatalkan peminjaman.']);
        }
    }

    public function destroy(Loan $loan)
    {
        if (auth()->user()->role !== 'SUPER ADMIN') {
            abort(403, 'Unauthorized action.');
        }

        try {
            DB::beginTransaction();

            if ($loan->status === 'Disewa') {
                $loan->itemUnit->update(['status' => 'Tersedia']);
            }

            // Store data for notification before deletion
            $loanData = [
                'id' => $loan->id,
                'nama_penyewa' => $loan->nama_penyewa,
                'no_tlp_penyewa' => $loan->no_tlp_penyewa,
                'item_name' => $loan->itemUnit->item->nama_barang,
                'unit_code' => $loan->itemUnit->kode_unit,
                'status' => $loan->status,
                'tanggal_sewa' => $loan->tanggal_sewa,
                'deadline_pengembalian' => $loan->deadline_pengembalian
            ];

            $loan->delete();

            DB::commit();

            // Send notification AFTER successful deletion
            $this->sendLoanDeletedNotification($loanData);

            return redirect()->route('loans.index')->with('success', 'Data peminjaman berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus data peminjaman.']);
        }
    }

    public function getFrequentlyRentedItems()
    {
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


    private function sendGroupedLoanCreatedNotification(array $loans)
    {
        if (empty($loans)) {
            return;
        }

        try {
            foreach ($loans as $loan) {
                $loan->load(['itemUnit.item']);
            }

            $firstLoan = $loans[0];
            $totalUnits = count($loans);

            $message = "<b>📋 PEMINJAMAN BARU</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL PEMINJAMAN:</b>\n";
            if ($totalUnits > 1) {
                $minId = min(array_column($loans, 'id'));
                $maxId = max(array_column($loans, 'id'));
                $message .= "• ID Peminjaman: <code>#{$minId} - #{$maxId}</code>\n";
            } else {
                $message .= "• ID Peminjaman: <code>#{$firstLoan->id}</code>\n";
            }
            $message .= "• Nama Penyewa: <b>{$firstLoan->nama_penyewa}</b>\n";
            $message .= "• No. Telepon: <code>{$firstLoan->no_tlp_penyewa}</code>\n\n";

            $message .= "<b>📦 DETAIL BARANG:</b>\n";
            $message .= "• Nama Barang: <b>{$firstLoan->itemUnit->item->nama_barang}</b>\n";
            $message .= "• Jumlah Unit: <b>{$totalUnits} unit</b>\n";

            // List all unit codes
            $message .= "• Kode Unit:\n";
            foreach ($loans as $index => $loan) {
                $message .= "  ├ <code>{$loan->itemUnit->kode_unit}</code>\n";
            }
            $message .= "\n";

            $message .= "<b>📅 JADWAL PEMINJAMAN:</b>\n";
            $message .= "• Tanggal Sewa: <b>{$firstLoan->tanggal_sewa->format('d/m/Y')}</b>\n";
            $message .= "• Deadline: <b>{$firstLoan->deadline_pengembalian->format('d/m/Y')}</b>\n";

            $daysUntilDeadline = ceil(now()->floatDiffInDays($firstLoan->deadline_pengembalian, false));
            if ($daysUntilDeadline > 0) {
                $message .= "• Sisa Waktu: <b>{$daysUntilDeadline} hari</b>\n\n";
            } else {
                $message .= "• Status: <b>⚠️ Sudah Melewati Deadline</b>\n\n";
            }

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕐 <i>Dibuat: "
                . $firstLoan->created_at->timezone(config('app.timezone'))->format('d/m/Y • H:i')
                . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send grouped loan created notification: ' . $e->getMessage());
        }
    }

    private function sendLoanUpdatedNotification(Loan $loan, int $oldUnitId, string $oldUnitCode)
    {
        try {
            $loan->load(['itemUnit.item']);

            $message = "<b>🔄 PEMINJAMAN DIPERBARUI</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL PEMINJAMAN:</b>\n";
            $message .= "• ID Peminjaman: <code>#{$loan->id}</code>\n";
            $message .= "• Nama Penyewa: <b>{$loan->nama_penyewa}</b>\n";
            $message .= "• No. Telepon: <code>{$loan->no_tlp_penyewa}</code>\n\n";

            if ($oldUnitId !== $loan->id_item_unit) {
                $oldUnit = ItemUnit::find($oldUnitId);
                $message .= "<b>🔄 PERUBAHAN UNIT:</b>\n";
                $message .= "• Unit Sebelumnya: <i>{$oldUnit->kode_unit} ({$oldUnit->item->nama_barang})</i>\n";
                $message .= "• Unit Terbaru: <b>{$loan->itemUnit->kode_unit} ({$loan->itemUnit->item->nama_barang})</b>\n\n";
            } else {
                $message .= "<b>📦 DETAIL BARANG:</b>\n";
                $message .= "• Nama Barang: <b>{$loan->itemUnit->item->nama_barang}</b>\n";
                $message .= "• Kode Unit: <code>{$loan->itemUnit->kode_unit}</code>\n\n";
            }

            $message .= "<b>📅 JADWAL PEMINJAMAN:</b>\n";
            $message .= "• Tanggal Sewa: <b>{$loan->tanggal_sewa->format('d/m/Y')}</b>\n";
            $message .= "• Deadline: <b>{$loan->deadline_pengembalian->format('d/m/Y')}</b>\n\n";

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕐 <i>Diperbarui: " . now()->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send loan updated notification: ' . $e->getMessage());
        }
    }

    private function sendLoanReturnedNotification(Loan $loan, Carbon $returnTime)
    {
        try {
            $loan->load(['itemUnit.item']);

            $isLate = $returnTime->gt($loan->deadline_pengembalian);
            $statusIcon = $isLate ? "⚠️" : "✅";
            $statusText = $isLate ? "TERLAMBAT" : "TEPAT WAKTU";

            $message = "<b>✅ PEMINJAMAN DIKEMBALIKAN</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL PEMINJAMAN:</b>\n";
            $message .= "• ID Peminjaman: <code>#{$loan->id}</code>\n";
            $message .= "• Nama Penyewa: <b>{$loan->nama_penyewa}</b>\n";
            $message .= "• No. Telepon: <code>{$loan->no_tlp_penyewa}</code>\n\n";

            $message .= "<b>📦 DETAIL BARANG:</b>\n";
            $message .= "• Nama Barang: <b>{$loan->itemUnit->item->nama_barang}</b>\n";
            $message .= "• Kode Unit: <code>{$loan->itemUnit->kode_unit}</code>\n\n";

            $message .= "<b>📅 DETAIL PENGEMBALIAN:</b>\n";
            $message .= "• Deadline: <b>{$loan->deadline_pengembalian->format('d/m/Y')}</b>\n";
            $message .= "• Dikembalikan: <b>{$returnTime->format('d/m/Y • H:i')}</b>\n";
            $message .= "• Status: <b>{$statusIcon} {$statusText}</b>\n\n";

            if ($isLate) {
                $lateDays = ceil($returnTime->floatDiffInDays($loan->deadline_pengembalian));
                $message .= "• Terlambat: <b>{$lateDays} hari</b>\n\n";
            }

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕐 <i>Dikembalikan: "
                . $returnTime->timezone(config('app.timezone'))->format('d/m/Y • H:i')
                . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send loan returned notification: ' . $e->getMessage());
        }
    }

    private function sendLoanCancelledNotification(Loan $loan)
    {
        try {
            $loan->load(['itemUnit.item']);

            $message = "<b>❌ PEMINJAMAN DIBATALKAN</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL PEMINJAMAN:</b>\n";
            $message .= "• ID Peminjaman: <code>#{$loan->id}</code>\n";
            $message .= "• Nama Penyewa: <b>{$loan->nama_penyewa}</b>\n";
            $message .= "• No. Telepon: <code>{$loan->no_tlp_penyewa}</code>\n\n";

            $message .= "<b>📦 DETAIL BARANG:</b>\n";
            $message .= "• Nama Barang: <b>{$loan->itemUnit->item->nama_barang}</b>\n";
            $message .= "• Kode Unit: <code>{$loan->itemUnit->kode_unit}</code>\n\n";

            $message .= "<b>📅 JADWAL PEMINJAMAN:</b>\n";
            $message .= "• Tanggal Sewa: <b>{$loan->tanggal_sewa->format('d/m/Y')}</b>\n";
            $message .= "• Deadline: <b>{$loan->deadline_pengembalian->format('d/m/Y')}</b>\n\n";

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕐 <i>Dibatalkan: " . now()->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send loan cancelled notification: ' . $e->getMessage());
        }
    }

    private function sendLoanDeletedNotification(array $loanData)
    {
        try {
            $message = "<b>🗑️ PEMINJAMAN DIHAPUS</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

            $message .= "<b>📋 DETAIL PEMINJAMAN:</b>\n";
            $message .= "• ID Peminjaman: <code>#{$loanData['id']}</code>\n";
            $message .= "• Nama Penyewa: <b>{$loanData['nama_penyewa']}</b>\n";
            $message .= "• No. Telepon: <code>{$loanData['no_tlp_penyewa']}</code>\n\n";

            $message .= "<b>📦 DETAIL BARANG:</b>\n";
            $message .= "• Nama Barang: <b>{$loanData['item_name']}</b>\n";
            $message .= "• Kode Unit: <code>{$loanData['unit_code']}</code>\n\n";

            $message .= "<b>📊 INFORMASI TERAKHIR:</b>\n";
            $message .= "• Status Terakhir: <b>{$loanData['status']}</b>\n";
            $message .= "• Tanggal Sewa: <b>{$loanData['tanggal_sewa']->format('d/m/Y')}</b>\n";
            $message .= "• Deadline: <b>{$loanData['deadline_pengembalian']->format('d/m/Y')}</b>\n\n";

            $message .= "━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "🕐 <i>Dihapus: " . now()->format('d/m/Y • H:i') . " WITA</i>";

            (new TelegramBotController)->sendMessage($message);
        } catch (\Exception $e) {
            \Log::error('Failed to send loan deleted notification: ' . $e->getMessage());
        }
    }
}
