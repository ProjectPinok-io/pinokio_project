<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('authors', function (Blueprint $table) {
            $table->timestamp('account_creation_date')->nullable();
            $table->integer('profile_completeness')->default(0);
            $table->float('commenting_frequency')->default(0.0);
            $table->boolean('is_public')->default(true);
            $table->integer('likes_count')->default(0);
            $table->integer('following_count')->default(0);
            $table->float('follower_following_ratio')->default(0.0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('authors', function (Blueprint $table) {
            $table->dropColumn([
                'account_creation_date',
                'profile_completeness',
                'commenting_frequency',
                'is_public',
                'likes_count',
                'following_count',
                'follower_following_ratio',
            ]);
        });
    }
};
