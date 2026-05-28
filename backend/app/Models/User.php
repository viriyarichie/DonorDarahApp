<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nik',
        'name',
        'email',
        'phone',
        'password',
        'birth_date',
        'blood_type',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'birth_date' => 'date',
        'password' => 'hashed',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function donors()
    {
        return $this->hasMany(Donor::class);
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class);
    }

    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    public function eventRegisters()
    {
        return $this->hasMany(EventRegister::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isPetugas(): bool
    {
        return $this->role === 'petugas';
    }

    public function isPendonor(): bool
    {
        return $this->role === 'pendonor';
    }

    public function getDonorCount(): int
    {
        return $this->donors()->where('donation_status', 'berhasil')->count();
    }
}
