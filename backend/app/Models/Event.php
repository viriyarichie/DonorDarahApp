<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'event_date',
        'quota',
        'location_id',
        'created_by',
    ];

    protected $casts = [
        'event_date' => 'datetime',
    ];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function eventRegisters()
    {
        return $this->hasMany(EventRegister::class);
    }

    public function registeredUsers()
    {
        return $this->belongsToMany(User::class, 'event_registers')
            ->withPivot('registered_at', 'status')
            ->withTimestamps();
    }

    public function getRegisteredCountAttribute(): int
    {
        return $this->eventRegisters()->count();
    }

    public function scopeUpcoming($query)
    {
        return $query->where('event_date', '>=', now())->orderBy('event_date');
    }
}
