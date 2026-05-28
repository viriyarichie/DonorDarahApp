<?php

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\ConditionController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DonorController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\StockController;
use Illuminate\Support\Facades\Route;

// ============ Public Routes ============
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public: Artikel & Event
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{article}', [ArticleController::class, 'show']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{event}', [EventController::class, 'show']);
Route::get('/locations', [LocationController::class, 'index']);
Route::get('/locations/{location}', [LocationController::class, 'show']);
Route::get('/stocks', [StockController::class, 'index']);

// ============ Authenticated Routes ============
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // ---- PENDONOR ----
    Route::middleware('role:pendonor,petugas,admin')->group(function () {
        // Booking
        Route::get('/bookings', [BookingController::class, 'index']);
        Route::post('/bookings', [BookingController::class, 'store']);
        Route::get('/bookings/{booking}', [BookingController::class, 'show']);
        Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);

        // Donor
        Route::get('/donors', [DonorController::class, 'index']);
        Route::get('/donors/stats', [DonorController::class, 'stats']);
        Route::get('/donors/{donor}', [DonorController::class, 'show']);

        // Condition
        Route::get('/kondisi/terbaru', [ConditionController::class, 'myLatest']);
        Route::get('/donors/{donor}/condition', [ConditionController::class, 'show']);

        // Certificates
        Route::get('/certificates', [CertificateController::class, 'index']);
        Route::post('/certificates/request', [CertificateController::class, 'request']);
        Route::get('/certificates/{certificate}/download', [CertificateController::class, 'download']);

        // Notifications
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

        // Events - register
        Route::post('/events/{event}/register', [EventController::class, 'register']);
    });

    // ---- PETUGAS & ADMIN ----
    Route::middleware('role:petugas,admin')->group(function () {
        // Booking management
        Route::post('/bookings/{booking}/confirm', [BookingController::class, 'confirm']);
        Route::post('/bookings/{booking}/complete', [BookingController::class, 'complete']);

        // Stock management
        Route::post('/stocks', [StockController::class, 'store']);
        Route::put('/stocks/{stock}', [StockController::class, 'update']);

        // Event management
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{event}', [EventController::class, 'update']);

        // Condition management
        Route::post('/donors/{donor}/condition', [ConditionController::class, 'store']);

        // Certificate verification
        Route::post('/certificates/{certificate}/approve', [CertificateController::class, 'approve']);
        Route::post('/certificates/{certificate}/reject', [CertificateController::class, 'reject']);
    });

    // ---- ADMIN ONLY ----
    Route::middleware('role:admin')->group(function () {
        // Article management
        Route::post('/articles', [ArticleController::class, 'store']);
        Route::put('/articles/{article}', [ArticleController::class, 'update']);
        Route::delete('/articles/{article}', [ArticleController::class, 'destroy']);

        // Stock delete
        Route::delete('/stocks/{stock}', [StockController::class, 'destroy']);

        // Event delete
        Route::delete('/events/{event}', [EventController::class, 'destroy']);
    });
});
