<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LoanController;
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
    return Inertia::render('dashboard');
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


Route::post('/register', [RegisteredUserController::class, 'store'])->name('register');

require __DIR__ . '/auth.php';
