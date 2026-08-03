<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Department\StoreDepartmentRequest;
use App\Http\Requests\Department\UpdateDepartmentRequest;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Department::query();

        if ($request->filled('name')) {
            $query->where('name', 'like', "%{$request->name}%");
        }

        return response()->json($query->get(), 200);
    }

    public function show(Department $department)
    {
        return response()->json($department);
    }

    public function store(StoreDepartmentRequest $request)
    {
        DB::beginTransaction();
        try {
            Department::create($request->validated());

            DB::commit();

            return response()->json([
                'message' => 'Department Created Sucessfully',
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['message' => 'Error: '.$th], 400);
        }
    }

    public function update(UpdateDepartmentRequest $request, Department $department)
    {
        $department = Department::find($request->id);
        if(!$department)
            return response()->json(['message' => 'Department Not found'], 404);

        DB::beginTransaction();
        try {
            $department->update($request->validated());

            DB::rollBack();

            return response()->json(['message' => 'Update Department Successfully'], 200);
        } catch (\Throwable $th) {
            DB::commit();
            return response()->json(['message' => 'Error: '.$th], 400);
        }
    }

    public function destroy(Department $department)
    {
        $department->delete();

        return response()->json(['message' => 'Department delete successfully']);
    }
}
