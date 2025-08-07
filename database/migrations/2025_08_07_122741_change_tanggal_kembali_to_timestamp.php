<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->timestamp('tanggal_kembali')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->date('tanggal_kembali')->nullable()->change();
        });
    }
};