<?php

namespace App\Http\Controllers;

use App\Models\{Item, Loan, ItemUnit};
use App\Http\Controllers\LoanController;
use App\Models\BrokenItemReport;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Fix: Use ItemUnit counts instead of Item sum
        $totalAvailable = ItemUnit::where('status', 'Tersedia')->count();
        $totalUnavailable = ItemUnit::whereIn('status', [
            'Tidak Tersedia',
            'Rusak',
            'Dalam Perbaikan'
        ])->count();

        $totalActiveLoans = Loan::where('status', 'Disewa')->count();
        $totalOverdue = Loan::where('status', 'Disewa')
            ->where('deadline_pengembalian', '<', now())
            ->count();

        // Exclude "Sudah Diperbaiki" status from broken items count
        $totalBrokenItems = BrokenItemReport::whereNotIn('status', ['repaired', 'rejected'])->count();
        $pendingRepairs = BrokenItemReport::where('status', 'reported')->count();

        $loanController = new LoanController();
        $monthlyLoanData = $loanController->getMonthlyStatistics();

        return inertia('dashboard', [
            'userName' => $user->name,
            'totalAvailable' => $totalAvailable,
            'totalUnavailable' => $totalUnavailable,
            'totalActiveLoans' => $totalActiveLoans,
            'totalOverdue' => $totalOverdue,
            'totalBrokenItems' => $totalBrokenItems,
            'pendingRepairs' => $pendingRepairs,
            'monthlyLoanData' => $monthlyLoanData,
        ]);
    }
}
