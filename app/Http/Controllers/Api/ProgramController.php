<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Program\StoreProgramRequest;
use App\Http\Requests\Program\UpdateProgramRequest;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $query = Program::query();

        if($request->filled('name')){
            $query->where('name', 'like', "%{$request->name}%");
        }

        return response()->json($query->get, 200);
    }

    public function show(Program $program)
    {
        return response()->json($program, 200);
    }

    public function store(StoreProgramRequest $request)
    {
        DB::beginTransaction();
        try {
            Program::create($request->validated());

            DB::commit();

            return response()->json(['message' => 'Program created successfully'], 201);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json(['message' => 'Error: '. $th], 400);
        }
    }

    public function update(UpdateProgramRequest $request, Program $program)
    {
        DB::beginTransaction();
        try {
            $program->update($request->validated());

            DB::commit();

            return response()->json(['Program updated successfully'], 200);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json(['message' => 'Error: '.$th], 400);
        }
    }

    public function destroy(Program $program)
    {
        $program->delete();

        return response()->json(['message' => 'Program deleted successfully'], 200);
    }
}
