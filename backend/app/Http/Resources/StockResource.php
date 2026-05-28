<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'blood_type' => $this->blood_type,
            'amount' => $this->amount,
            'status' => $this->getStatusLabel(),
            'status_color' => $this->getStatusColor(),
            'location' => $this->whenLoaded('location', fn() => [
                'id' => $this->location->id,
                'name' => $this->location->name,
                'address' => $this->location->address,
                'type' => $this->location->getTypeLabel(),
            ]),
            'updated_at' => $this->updated_at?->format('d/m/Y H:i'),
        ];
    }
}
