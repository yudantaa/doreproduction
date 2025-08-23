<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('broken_item_reports', function (Blueprint $table) {
            $table->foreignId('id_item_unit')->constrained('item_units', 'id')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('broken_item_reports', function (Blueprint $table) {
            $table->dropForeign(['id_item_unit']);
            $table->dropColumn('id_item_unit');
        });
    }
};
