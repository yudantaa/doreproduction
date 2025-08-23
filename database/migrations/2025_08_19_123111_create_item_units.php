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
        Schema::create('item_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_barang')->constrained('items')->onDelete('cascade');
            $table->string('kode_unit')->unique();
            $table->enum('status', ['Tersedia', 'Tidak Tersedia', 'Rusak', 'Dalam Perbaikan', 'Disewa']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_units');
    }
};
