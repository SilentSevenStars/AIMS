<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Office\StoreOfficeRequest;
use App\Http\Requests\Office\UpdateOfficeRequest;
use App\Models\Office;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OfficeController extends Controller
{
    public function index(Request $request)
    {
        $query = Office::query();

        if ($request->filled('name')) {
            $query->where('name', 'like', "%{$request->name}%");
        }

        return response()->json($query->get(), 200);
    }

    public function show(Office $office)
    {
        return response()->json($office);
    }

    public function store(StoreOfficeRequest $request)
    {
        DB::beginTransaction();
        try {
            Office::create($request->validated());

            DB::commit();

            return response()->json(['message' => 'Office created successfully'], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['message' => 'Error: '. $th], 400);
        }
    }

    public function update(UpdateOfficeRequest $request, Office $office)
    {
        DB::beginTransaction();
        try {
            $office->update($request->validated());

            DB::commit();

            return response()->json(['message' => 'Office updated successfully'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['message' => 'Error: '.$th], 400);
        }
    }

    public function destroy(Office $office)
    {
        $office->delete();

        return response()->json(['message' => 'Office deleted successully'], 200);
    }
}
