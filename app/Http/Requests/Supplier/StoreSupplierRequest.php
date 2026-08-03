<?php

namespace App\Http\Requests\Supplier;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'min:14', 'max:14'],
            'tel' => ['nullable', 'string', 'min:10', 'max:10'],
            'email' => ['required', 'string'],
            'address' => ['required', 'string', 'max:255'],
            'tin' => ['required', 'string', 'max:100'],
            'image_url' => ['nullable', 'string'],
        ];
    }
}
