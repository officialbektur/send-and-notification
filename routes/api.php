<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

Route::post('/post', App\Http\Controllers\Post\StoreController::class)->name('api.post.store');
Route::post('/image', App\Http\Controllers\Image\StoreController::class)->name('api.image.store');
