<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'donation_date' => $this->donation_date?->format('Y-m-d'),
            'donation_date_formatted' => $this->donation_date?->format('d/m/Y'),
            'donation_status' => $this->donation_status,
            'user' => new UserResource($this->whenLoaded('user')),
            'condition' => new ConditionResource($this->whenLoaded('condition')),
            'created_at' => $this->created_at?->format('d/m/Y H:i'),
        ];
    }
}
