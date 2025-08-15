<?php
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    HomeController,
    DashboardController,
    CategoryController,
    ItemController,
    ProfileController,
    LoanController,
    UserController,
    UtilityController,
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

    Route::put('/broken-items/{report}', [BrokenItemReportController::class, 'updateStatus'])
        ->middleware('isSuperAdmin')
        ->name('dashboard.broken-items.update');
});

// Utility routes (protected by auth and super admin middleware)
Route::middleware(['auth', 'isSuperAdmin'])->prefix('utilities')->group(function () {
    Route::get('/clear-cache', [UtilityController::class, 'clearCache'])->name('utility.cache');
    Route::get('/clear-config', [UtilityController::class, 'clearConfig'])->name('utility.config');
    Route::get('/clear-routes', [UtilityController::class, 'clearRoutes'])->name('utility.routes');
    Route::get('/clear-views', [UtilityController::class, 'clearViews'])->name('utility.views');
    Route::get('/clear-all', [UtilityController::class, 'clearAllCaches'])->name('utility.clear-all');
    Route::get('/migrate', [UtilityController::class, 'migrate'])->name('utility.migrate');
    Route::get('/migrate-fresh', [UtilityController::class, 'migrateFreshSeed'])->name('utility.migrate-fresh');
    Route::get('/seed', [UtilityController::class, 'runSeeder'])->name('utility.seed');
    Route::get('/clear-logs', [UtilityController::class, 'clearLogs'])->name('utility.logs');
    Route::get('/clear-temp', [UtilityController::class, 'clearTempFiles'])->name('utility.temp');
    Route::get('/app-version', [UtilityController::class, 'appVersion'])->name('utility.version');
    Route::get('/php-info', [UtilityController::class, 'phpInfo'])->name('utility.php');
    Route::get('/server-info', [UtilityController::class, 'serverInfo'])->name('utility.server');
    Route::get('/toggle-maintenance', [UtilityController::class, 'toggleMaintenance'])->name('utility.maintenance');
    Route::get('/generate-key', [UtilityController::class, 'generateKey'])->name('utility.key');
    Route::get('/link-storage', [UtilityController::class, 'linkStorage'])->name('utility.storage');
    Route::get('/check-url', [UtilityController::class, 'checkUrl'])->name('utility.url');
});
