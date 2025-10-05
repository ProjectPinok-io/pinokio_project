<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/posts', [PostController::class, 'store']);
Route::get('/posts/{id}', [PostController::class, 'show']);
Route::put('/posts/{id}/evaluate', [PostController::class, 'evaluate']);
Route::post('/evaluations', [EvaluationController::class, 'store']);
Route::post('/reports', [ReportController::class, 'store']);
