<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Personnel\StorePersonnelRequest;
use App\Models\Personnel;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class PersonnelController extends Controller
{
    public function index()
    {
        $personnels = Personnel::where('status', 'active')->get();

        return response()->json($personnels);
    }

    public function show(Personnel $personnel)
    {
        return response()->json($personnel);
    }

    public function store(StorePersonnelRequest $request)
    {
        DB::beginTransaction();
        try {
            Personnel::create([
                'personnel_id' => $request->personnel_id,
                'first_name' => $request->first_name,
                'middle_name' => $request->middle_name,
                'last_name' => $request->last_name,
                'position' => $request->position,
                'email' => $request->email,
                'status' => $request->status,
                'program_id' => $request->program_id,
                'office_id' => $request->office_id,
                'department_id' => $request->department_id,
                'image_url' => $request->image_url,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Personnel created successfully',
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                "message" => " Error: ". $th
            ], 400);
        }
    }
}
