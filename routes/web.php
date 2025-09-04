<?php
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    HomeController,
    DashboardController,
    CategoryController,
    ItemController,
    ItemUnitController,
    ProfileController,
    LoanController,
    UserController,
    BrokenItemReportController
};

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/peralatan', [HomeController::class, 'peralatan'])->name('peralatan');

// Authentication routes
require __DIR__ . '/auth.php';

// Disabled registration route
Route::get('/register', function () {
    return Inertia::render('errors/registration-disabled');
})->name('errors.registration-disabled');

// Dashboard group (authenticated and role-checked)
Route::middleware(['auth', 'role'])->prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', UserController::class)->middleware('isSuperAdmin');
    Route::resource('items', ItemController::class);
    Route::resource('item-units', ItemUnitController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('loans', LoanController::class);
    Route::post('loans/{loan}/return', [LoanController::class, 'return'])->name('loans.return');
    Route::post('loans/{loan}/cancel', [LoanController::class, 'cancel'])->name('loans.cancel');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Broken Items Routes within Dashboard
    Route::get('/broken-items', [BrokenItemReportController::class, 'index'])
        ->name('dashboard.broken-items.index');

    Route::post('/broken-items', [BrokenItemReportController::class, 'store'])
        ->name('dashboard.broken-items.store');

    Route::get('/broken-items/create', [BrokenItemReportController::class, 'create'])
        ->name('dashboard.broken-items.create');

    Route::get('/broken-items/{report}', [BrokenItemReportController::class, 'show'])
        ->name('dashboard.broken-items.show');

    Route::post('/broken-items/{report}/request-repair', [BrokenItemReportController::class, 'requestRepair'])
        ->middleware('role:ADMIN')
        ->name('dashboard.broken-items.request-repair');

    Route::put('/broken-items/{report}', [BrokenItemReportController::class, 'update'])
        ->middleware('isSuperAdmin')
        ->name('dashboard.broken-items.update');

    Route::put('/broken-items/{report}/update-notes', [BrokenItemReportController::class, 'updateNotes'])
        ->name('dashboard.broken-items.update-notes');
});
