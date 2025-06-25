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
use App\Models\{Item, Loan, Category};
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    $items = Item::all();
    $categories = Category::all();

    return Inertia::render('homepage', [
        'items' => $items,
        'categories' => $categories,
        'isAuthenticated' => Auth::check() && Auth::user()->role,
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

    Route::resource('users', UserController::class);
    Route::resource('items', ItemController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('loans', LoanController::class);

    Route::get('/dashboard/users', [UserController::class, 'index'])
        ->middleware('isSuperAdmin')
        ->name('users.index');

    Route::get('/dashboard/items', [ItemController::class, 'index'])->name('items.index');
    Route::get('/dashboard/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/dashboard/loans', [LoanController::class, 'index'])->name('loans.index');

    Route::post('dashboard/loans/{loan}/return', [LoanController::class, 'return'])->name('loans.return');
    Route::post('dashboard/loans/{loan}/cancel', [LoanController::class, 'cancel'])->name('loans.cancel');

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

Route::middleware(['auth'])->middleware('isSuperAdmin')->get('/run-seeder', function () {

    Artisan::call('db:seed', ['--force' => true]);
    return Artisan::output();
});


require __DIR__ . '/auth.php';
