<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'location_id' => 'required|exists:locations,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'notes' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'location_id.required' => 'Lokasi donor wajib dipilih.',
            'location_id.exists' => 'Lokasi donor tidak valid.',
            'booking_date.required' => 'Tanggal booking wajib diisi.',
            'booking_date.date' => 'Format tanggal booking tidak valid.',
            'booking_date.after_or_equal' => 'Tanggal booking tidak boleh sebelum hari ini.',
        ];
    }
}
