<?php

namespace App\Http\Controllers;

use App\Models\{Item, Loan};
use App\Http\Controllers\LoanController;
use App\Models\BrokenItemReport;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $totalAvailable = Item::where('status', 'Tersedia')->sum('jumlah');
        $totalUnavailable = Item::where('status', 'Tidak Tersedia')->sum('jumlah');
        $totalActiveLoans = Loan::where('status', 'Disewa')->count();
        $totalOverdue = Loan::where('status', 'Disewa')
            ->where('deadline_pengembalian', '<', now())
            ->count();


        $totalBrokenItems = BrokenItemReport::count();
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
