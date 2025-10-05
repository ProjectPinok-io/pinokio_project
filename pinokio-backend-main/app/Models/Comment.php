<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'user_id',
        'content',
        'likes_count',
        'replies_count',
        'linguistic_score',
    ];

    protected $casts = [
        'likes_count' => 'integer',
        'replies_count' => 'integer',
        'linguistic_score' => 'float',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
