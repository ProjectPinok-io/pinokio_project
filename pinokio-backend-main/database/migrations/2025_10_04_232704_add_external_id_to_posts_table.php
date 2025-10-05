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
        Schema::table('posts', function (Blueprint $table) {
            // Add external_id column, assuming it's a string and should be unique
            $table->string('external_id')->unique()->nullable()->after('id'); // Added after 'id' for better organization
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropUnique('posts_external_id_unique'); // Drop the unique constraint first
            $table->dropColumn('external_id');
        });
    }
};