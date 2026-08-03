<?php

namespace App\Http\Requests\Personnel;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePersonnelRequest extends FormRequest
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
            'personnel_id' => ['required', 'string', 'unique:personnels'],
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'max:255', 'unique:personnels'],
            'status' => ['required', 'string', 'max:255'],
            'program_id' => ['required', 'exists:programs,id'],
            'office_id' => ['nullable', 'exists:offices,id'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'image_url' => ['nullable', 'string'],
        ];
    }
}
