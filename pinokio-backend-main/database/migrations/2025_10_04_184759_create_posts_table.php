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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username');
            $table->text('content');
            $table->dateTime('published_at');
            $table->boolean('is_verified')->default(false);
            $table->integer('views')->default(0);
            $table->integer('comments')->default(0);
            $table->integer('reposts')->default(0);
            $table->integer('likes')->default(0);
            $table->integer('bookmarks')->default(0);
            $table->json('related_profiles')->nullable();
            $table->string('status')->default('Nie wiadomo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
