<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    use HasFactory;

    protected $fillable = [
        'username',
        'name',
        'is_verified',
        'followers',
        'following',
        'account_creation_date',
        'profile_completeness',
        'commenting_frequency',
        'is_public',
        'likes_count',
        'following_count',
        'follower_following_ratio',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'account_creation_date' => 'datetime',
        'is_public' => 'boolean',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class, 'username', 'username');
    }
}
