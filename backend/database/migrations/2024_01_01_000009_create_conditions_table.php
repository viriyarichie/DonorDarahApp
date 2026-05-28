<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conditions', function (Blueprint $table) {
            $table->id();
            $table->decimal('hemoglobin', 5, 2);
            $table->string('blood_pressure', 20);
            $table->enum('eligibility_status', ['layak', 'tidak_layak', 'ditunda']);
            $table->text('notes')->nullable();
            $table->foreignId('donor_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conditions');
    }
};
