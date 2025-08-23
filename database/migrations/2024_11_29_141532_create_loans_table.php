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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_penyewa');
            $table->string('no_tlp_penyewa');
            $table->date('tanggal_sewa');
            $table->date('tanggal_kembali')->nullable();
            $table->date('deadline_pengembalian');
            $table->enum('status', ['Disewa', 'Dikembalikan', 'Dibatalkan']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};