<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'issue_date',
        'milestone',
        'file_path',
        'status',
        'user_id',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'milestone' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function getMilestones(): array
    {
        return [10, 25, 50, 75, 100];
    }
}
