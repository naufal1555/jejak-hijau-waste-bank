<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\WasteDepositController;
use App\Http\Controllers\Api\CarbonImpactController;

/*
|--------------------------------------------------------------------------
| API Routes - Jejak Hijau Laravel 11 Backend
|--------------------------------------------------------------------------
| Author: Ahmad Fathin Naufal (UGM) - Fullstack Developer
*/

Route::prefix('v1')->group(function () {
    // 1. Members Management
    Route::get('/members', [MemberController::class, 'index']);
    Route::post('/members', [MemberController::class, 'store']);
    Route::get('/members/{id}', [MemberController::class, 'show']);

    // 2. Waste Deposits & Ledgers
    Route::get('/deposits', [WasteDepositController::class, 'index']);
    Route::post('/deposits', [WasteDepositController::class, 'store']);
    Route::post('/withdrawals', [WasteDepositController::class, 'withdraw']);

    // 3. Carbon Impact & ESG Analytics
    Route::get('/impact/summary', [CarbonImpactController::class, 'getSummary']);
    Route::get('/impact/categories', [CarbonImpactController::class, 'getCategoryBreakdown']);
});
