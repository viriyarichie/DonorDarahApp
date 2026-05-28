<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConditionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'hemoglobin' => $this->hemoglobin,
            'blood_pressure' => $this->blood_pressure,
            'eligibility_status' => $this->eligibility_status,
            'eligibility_label' => $this->getEligibilityLabel(),
            'notes' => $this->notes,
            'created_at' => $this->created_at?->format('d/m/Y H:i'),
        ];
    }
}
