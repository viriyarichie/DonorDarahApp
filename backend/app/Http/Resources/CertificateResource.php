<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'milestone' => $this->milestone,
            'status' => $this->status,
            'issue_date' => $this->issue_date?->format('d/m/Y'),
            'file_url' => $this->file_path ? asset('storage/' . $this->file_path) : null,
            'can_download' => $this->status === 'disetujui' && !is_null($this->file_path),
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at?->format('d/m/Y H:i'),
        ];
    }
}
