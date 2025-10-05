<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'user_id',
        'evaluation',
    ];

    protected $casts = [
        'evaluation' => 'string',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
