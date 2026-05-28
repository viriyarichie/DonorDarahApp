<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'address',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function getTypeLabel(): string
    {
        return match($this->type) {
            'unit_tetap' => 'Unit Tetap',
            'unit_mobile' => 'Unit Mobile',
            'rumah_sakit' => 'Rumah Sakit',
            default => $this->type,
        };
    }
}
