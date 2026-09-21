<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Supplier\StoreSupplierRequest;
use App\Http\Requests\Supplier\UpdateSupplierRequest;
use App\Models\Supplier;
use App\Services\GoogleDriveService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function __construct(private GoogleDriveService $drive)
    {
    }

    public function index()
    {
        return Inertia::render('supplier/index', [
            'suppliers' => Supplier::orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('supplier/create');
    }

    public function show(Supplier $supplier)
    {
        return Inertia::render('supplier/show', [
            'supplier' => $supplier,
        ]);
    }

    public function edit(Supplier $supplier)
    {
        return Inertia::render('supplier/edit', [
            'supplier' => $supplier,
        ]);
    }

    public function store(StoreSupplierRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->safe()->except('image');

            if ($request->hasFile('image')) {
                $uploaded = $this->drive->upload(
                    $request->file('image'),
                    config('services.google_drive.folders.supplier')
                );
                $data['image_url'] = $uploaded['url'];
                $data['image_file_id'] = $uploaded['file_id'];
            }

            Supplier::create($data);
            DB::commit();

            return redirect()->route('supplier.index')->with('success', 'Supplier created successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();
            report($th);
            return back()->withInput()->with('error', 'Something went wrong.');
        }
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        DB::beginTransaction();
        try {
            $data = $request->safe()->except(['image', 'remove_image']);

            if ($request->hasFile('image')) {
                if ($supplier->image_file_id) {
                    $this->drive->delete($supplier->image_file_id);
                }
                $uploaded = $this->drive->upload(
                    $request->file('image'),
                    config('services.google_drive.folders.supplier')
                );
                $data['image_url'] = $uploaded['url'];
                $data['image_file_id'] = $uploaded['file_id'];
            } elseif ($request->boolean('remove_image')) {
                if ($supplier->image_file_id) {
                    $this->drive->delete($supplier->image_file_id);
                }
                $data['image_url'] = null;
                $data['image_file_id'] = null;
            }

            $supplier->update($data);
            DB::commit();

            return redirect()->route('supplier.index')->with('success', 'Supplier updated successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();
            report($th);
            return back()->withInput()->with('error', 'Something went wrong.');
        }
    }

    public function destroy(Supplier $supplier)
    {
        if ($supplier->image_file_id) {
            $this->drive->delete($supplier->image_file_id);
        }
        $supplier->delete();

        return redirect()->route('supplier.index')->with('success', 'Supplier deleted successfully.');
    }

}
