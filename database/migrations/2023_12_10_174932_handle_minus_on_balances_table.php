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
        Schema::table('incomes', function (Blueprint $table) {
            $table->bigInteger('balance_before', false)->change();
            $table->bigInteger('balance_after', false)->change();
        });
        Schema::table('outcomes', function (Blueprint $table) {
            $table->bigInteger('balance_before', false)->change();
            $table->bigInteger('balance_after', false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('incomes', function (Blueprint $table) {
            $table->bigInteger('balance_before', true)->change();
            $table->bigInteger('balance_after', true)->change();
        });
        Schema::table('outcomes', function (Blueprint $table) {
            $table->bigInteger('balance_before', true)->change();
            $table->bigInteger('balance_after', true)->change();
        });
    }
};
