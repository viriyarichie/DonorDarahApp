<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_date' => $this->booking_date?->format('Y-m-d'),
            'booking_date_formatted' => $this->booking_date?->format('d/m/Y'),
            'status' => $this->status,
            'notes' => $this->notes,
            'user' => new UserResource($this->whenLoaded('user')),
            'location' => $this->whenLoaded('location', fn() => [
                'id' => $this->location->id,
                'name' => $this->location->name,
                'address' => $this->location->address,
                'type' => $this->location->getTypeLabel(),
            ]),
            'donor' => new DonorResource($this->whenLoaded('donor')),
            'created_at' => $this->created_at?->format('d/m/Y H:i'),
        ];
    }
}
