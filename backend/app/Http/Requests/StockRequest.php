<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StockRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'blood_type' => 'required|in:A,B,AB,O',
            'amount' => 'required|integer|min:0',
            'location_id' => 'required|exists:locations,id',
        ];
    }

    public function messages(): array
    {
        return [
            'blood_type.required' => 'Golongan darah wajib diisi.',
            'blood_type.in' => 'Golongan darah tidak valid.',
            'amount.required' => 'Jumlah stok wajib diisi.',
            'amount.integer' => 'Jumlah stok harus berupa angka bulat.',
            'amount.min' => 'Jumlah stok tidak boleh negatif.',
            'location_id.required' => 'Lokasi wajib dipilih.',
            'location_id.exists' => 'Lokasi tidak valid.',
        ];
    }
}
