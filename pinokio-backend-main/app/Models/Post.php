<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'username',
        'content',
        'published_at',
        'is_verified',
        'views',
        'comments',
        'reposts',
        'likes',
        'bookmarks',
        'related_profiles',
        'status',
        'positive_evaluations_count',
        'negative_evaluations_count',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_verified' => 'boolean',
        'related_profiles' => 'array',
        'positive_evaluations_count' => 'integer',
        'negative_evaluations_count' => 'integer',
    ];

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function author()
    {
        return $this->belongsTo(Author::class, 'username', 'username');
    }

    public function calculateCredibilityStatus(): string
    {
        if ($this->negative_evaluations_count >= 3) {
            return 'Warning';
        } elseif ($this->positive_evaluations_count >= 5) {
            return 'Valid';
        }

        return 'Unknown';
    }
}
