<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'event_date' => 'required|date|after:now',
            'quota' => 'sometimes|integer|min:1|max:1000',
            'location_id' => 'required|exists:locations,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama event wajib diisi.',
            'description.required' => 'Deskripsi event wajib diisi.',
            'event_date.required' => 'Tanggal event wajib diisi.',
            'event_date.after' => 'Tanggal event harus di masa mendatang.',
            'quota.integer' => 'Kuota harus berupa angka.',
            'quota.min' => 'Kuota minimal 1.',
            'location_id.required' => 'Lokasi event wajib dipilih.',
            'location_id.exists' => 'Lokasi tidak valid.',
        ];
    }
}
