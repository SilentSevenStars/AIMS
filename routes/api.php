<?php

use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\ProgramController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::middleware(["auth:api"])->group(function(){
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::prefix('api')->name('api.')->group(function(){
        Route::prefix('supplier')->name('supplier.')->group(function(){
            Route::get('/', [SupplierController::class, "index"])->name('index');
            Route::get('/{supplier}', [SupplierController::class, "show"])->name('show');
            Route::post('/', [SupplierController::class, "store"])->name('store');
            Route::put("/{supplier}", [SupplierController::class, 'update'])->name('update');
            Route::patch("/archive/{supplier}", [SupplierController::class, 'archive'])->name('archive');
            Route::patch("/restore/{supplier}", [SupplierController::class, 'restore'])->name('restore');
            Route::delete("/{supplier}", [SupplierController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('program')->name('program.')->group(function(){
            Route::get('/', [ProgramController::class, 'index'])->name('index');
            Route::get('/{program}', [ProgramController::class, 'show'])->name('show');
            Route::post('/', [ProgramController::class, 'store'])->name('store');
            Route::put('/{program}', [ProgramController::class, 'update'])->name('update');
            Route::delete('/{program}', [ProgramController::class, 'destroy'])->name('delete');
        });

        Route::prefix('office')->name('office.')->group(function(){
            Route::get('/', [OfficeController::class, 'index'])->name('index');
            Route::get('/{office}', [OfficeController::class, 'show'])->name('show');
            Route::post('/', [OfficeController::class, 'store'])->name('store');
            Route::put('/{program}', [OfficeController::class, 'update'])->name('update');
            Route::delete('/{program}', [OfficeController::class, 'destroy'])->name('destroy');
        });

        Route::prefix('department')->name('department.')->group(function(){
            Route::get('/', [DepartmentController::class, 'index'])->name('index');
            Route::get('/{department}', [DepartmentController::class, 'show'])->name('show');
            Route::post('/', [DepartmentController::class, 'store'])->name('store');
            Route::put('/{department}', [DepartmentController::class, 'update'])->name('update');
            Route::delete('/{department}', [DepartmentController::class, 'destroy'])->name('delete');
        });
    });
});
