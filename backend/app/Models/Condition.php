<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Condition extends Model
{
    use HasFactory;

    protected $fillable = [
        'hemoglobin',
        'blood_pressure',
        'eligibility_status',
        'notes',
        'donor_id',
    ];

    protected $casts = [
        'hemoglobin' => 'float',
    ];

    public function donor()
    {
        return $this->belongsTo(Donor::class);
    }

    public function getEligibilityLabel(): string
    {
        return match($this->eligibility_status) {
            'layak' => 'Layak Donor',
            'tidak_layak' => 'Tidak Layak',
            'ditunda' => 'Ditunda',
            default => $this->eligibility_status,
        };
    }
}
