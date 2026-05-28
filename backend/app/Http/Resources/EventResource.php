<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'event_date' => $this->event_date?->format('Y-m-d H:i:s'),
            'event_date_formatted' => $this->event_date?->format('d/m/Y H:i'),
            'quota' => $this->quota,
            'registered_count' => $this->event_registers_count ?? $this->eventRegisters()->count(),
            'location' => $this->whenLoaded('location', fn() => [
                'id' => $this->location->id,
                'name' => $this->location->name,
                'address' => $this->location->address,
                'latitude' => $this->location->latitude,
                'longitude' => $this->location->longitude,
                'type' => $this->location->getTypeLabel(),
            ]),
            'creator' => $this->whenLoaded('creator', fn() => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ]),
            'created_at' => $this->created_at?->format('d/m/Y H:i'),
        ];
    }
}
