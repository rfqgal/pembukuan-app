<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\OutcomeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/api/income', [DashboardController::class, 'incomeApi'])->name('dashboard.api.income');
        Route::get('/api/outcome', [DashboardController::class, 'outcomeApi'])->name('dashboard.api.outcome');
    });

    Route::get('/income/api', [IncomeController::class, 'indexApi'])->name('income.index.api');
    Route::get('/income/export', [IncomeController::class, 'export'])->name('income.export');
    Route::get('/income/create/api', [IncomeController::class, 'createApi'])->name('income.create.api');
    Route::resource('income', IncomeController::class);
    
    Route::get('/outcome/api', [OutcomeController::class, 'indexApi'])->name('outcome.index.api');
    Route::get('/outcome/export', [OutcomeController::class, 'export'])->name('outcome.export');
    Route::get('/outcome/create/api', [OutcomeController::class, 'createApi'])->name('outcome.create.api');
    Route::resource('outcome', OutcomeController::class);
});

require __DIR__.'/auth.php';
