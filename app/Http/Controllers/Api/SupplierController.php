<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Supplier\StoreSupplierRequest;
use App\Http\Requests\Supplier\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $query = Supplier::query();

        if ($request->filled('name')) {
            $query->where('name', 'like', "%{$request->name}%");
        }

        return response()->json($query->get(), 200);
    }

    public function show(Supplier $supplier)
    {
        return response()->json($supplier, 200);
    }

    public function store(StoreSupplierRequest $request)
    {
        DB::beginTransaction();

        try {
            Supplier::create($request->validated());

            DB::commit();

            return response()->json(['message' => 'Supplier created successfully'], 201);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json(['message' => 'Error: '. $th], 400);
        }
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        DB::beginTransaction();
        try {
            $supplier->update($request->validated());

            DB::commit();

            return response()->json(['message' => 'Supplier updated successfully'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json(['message' => 'Error: '. $th], 400);
        }
    }

    public function archive(Supplier $supplier)
    {
        if($supplier->active === false)
            return response()->json(['message' => 'Supplier is already inactive'], 400);

        DB::beginTransaction();
        try {
            $supplier->update([
                'active' => false,
            ]);

            DB::commit();

            return response()->json(['message' => 'Supplier archive successfully'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['message' => 'Error: '.$th], 400);
        }
    }

    public function restore(Supplier $supplier)
    {
        if($supplier->active === true)
            return response()->json(['message' => 'Supplier is already active'], 400);

        DB::beginTransaction();
        try {
            $supplier->update([
                'active' => true,
            ]);

            DB::commit();

            return response()->json(['message' => 'Supplier restore successfully']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json(['message' => 'Error: '.$th], 400);
        }
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return response()->json(['message' => 'Supplier deleted successfully'], 200);
    }
}
