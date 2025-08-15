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
        Schema::create('broken_item_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained('items');
            $table->foreignId('reporter_id')->constrained('users');
            $table->text('description');
            $table->string('proof_image_path')->nullable();
            $table->enum('status', ['reported', 'repair_requested', 'in_repair', 'repaired', 'rejected'])->default('reported');
            $table->text('repair_notes')->nullable();
            $table->foreignId('repair_requester_id')->nullable()->constrained('users');
            $table->timestamp('repair_requested_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('broken_items_report');
    }
};