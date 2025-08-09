<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    HomeController,
    DashboardController,
    CategoryController,
    ItemController,
    ProfileController,
    LoanController,
    UserController,
    UtilityController
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
Route::middleware(['auth', 'has.role'])->prefix('dashboard')->group(function () {
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
