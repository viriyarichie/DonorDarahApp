<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nik' => $this->nik,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'blood_type' => $this->blood_type,
            'role' => $this->role,
            'total_donor' => $this->whenLoaded('donors', fn() => $this->getDonorCount()),
            'created_at' => $this->created_at?->format('d/m/Y'),
        ];
    }
}
