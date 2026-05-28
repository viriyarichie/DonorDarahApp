<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donor extends Model
{
    use HasFactory;

    protected $fillable = [
        'donation_date',
        'donation_status',
        'user_id',
    ];

    protected $casts = [
        'donation_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function condition()
    {
        return $this->hasOne(Condition::class);
    }

    public function booking()
    {
        return $this->hasOne(Booking::class);
    }
}
