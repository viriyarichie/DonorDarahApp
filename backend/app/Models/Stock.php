<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'blood_type',
        'amount',
        'location_id',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function getStatusLabel(): string
    {
        if ($this->amount >= 20) return 'Aman';
        if ($this->amount >= 10) return 'Perlu Perhatian';
        return 'Kritis';
    }

    public function getStatusColor(): string
    {
        if ($this->amount >= 20) return 'green';
        if ($this->amount >= 10) return 'yellow';
        return 'red';
    }
}
