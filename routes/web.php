<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LoanController;
use App\Models\Item;
use App\Models\Loan;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = Auth::user();
    $totalAvailable = Item::where('status', 'Tersedia')->sum('jumlah');
    $totalUnavailable = Item::where('status', 'Tidak Tersedia')->sum('jumlah');
    $totalActiveLoans = Loan::where('status', 'Disewa')->count();
    $totalOverdue = Loan::where('status', 'Disewa')
        ->where('deadline_pengembalian', '<', now())
        ->count();

    $loanController = new LoanController();
    $monthlyLoanData = $loanController->getMonthlyStatistics();

    return Inertia::render('dashboard', [
        'userName' => $user->name,
        'totalAvailable' => $totalAvailable,
        'totalUnavailable' => $totalUnavailable,
        'totalActiveLoans' => $totalActiveLoans,
        'totalOverdue' => $totalOverdue,
        'monthlyLoanData' => $monthlyLoanData,
    ]);
})->middleware(['auth'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/dashboard/items', [ItemController::class, 'index'])->name('items.index');
    Route::get('/dashboard/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/dashboard/loans', [LoanController::class, 'index'])->name('loans.index');

});

Route::resource('users', UserController::class)
    ->middleware(['auth']);
Route::resource('items', ItemController::class)
    ->middleware(['auth']);
Route::resource('categories', CategoryController::class)
    ->middleware(['auth']);
Route::resource('loans', LoanController::class)
    ->middleware(['auth']);
Route::post('/loans/{loan}/return', [LoanController::class, 'return'])->name('loans.return');
Route::post('/loans/{loan}/cancel', [LoanController::class, 'cancel'])->name('loans.cancel');


Route::post('/register', [RegisteredUserController::class, 'store'])->name('register');

require __DIR__ . '/auth.php';
