<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Inertia\Inertia;
use App\Http\Controllers\{
    CategoryController,
    ItemController,
    ProfileController,
    LoanController,
    UserController,
    RegisteredUserController
};
use App\Models\{Item, Loan};
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Only authenticated users with a role can access dashboard and its children
Route::middleware(['auth', 'has.role'])->group(function () {
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
    })->name('dashboard');

    // Other dashboard routes
    Route::get('/dashboard/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/dashboard/items', [ItemController::class, 'index'])->name('items.index');
    Route::get('/dashboard/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/dashboard/loans', [LoanController::class, 'index'])->name('loans.index');

    Route::resource('users', UserController::class);
    Route::resource('items', ItemController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('loans', LoanController::class);
    Route::post('/loans/{loan}/return', [LoanController::class, 'return'])->name('loans.return');
    Route::post('/loans/{loan}/cancel', [LoanController::class, 'cancel'])->name('loans.cancel');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Open to everyone (including guests)
Route::post('/register', [RegisteredUserController::class, 'store'])->name('register');

// Utility
Route::get('/cache-fix', function () {
    Artisan::call('config:clear');
    Artisan::call('config:cache');
    Artisan::call('route:clear');
    Artisan::call('view:clear');
    return '✅ Config cache cleared and rebuilt.';
});

Route::get('/check-url', fn() => config('app.url'));

Route::middleware(['auth'])->get('/run-seeder', function () {
    if (auth()->user()->role !== 'SUPER ADMIN') {
        abort(403);
    }

    Artisan::call('db:seed', ['--force' => true]);
    return Artisan::output();
});


require __DIR__ . '/auth.php';
