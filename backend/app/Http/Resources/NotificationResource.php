<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'message' => $this->message,
            'type' => $this->type,
            'is_read' => $this->is_read,
            'created_at' => $this->created_at?->format('d/m/Y H:i'),
            'created_at_diff' => $this->created_at?->diffForHumans(),
        ];
    }
}
