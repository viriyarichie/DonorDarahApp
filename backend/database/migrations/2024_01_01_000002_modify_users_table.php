<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('nik', 16)->unique()->after('id');
            $table->string('phone', 20)->nullable()->after('email');
            $table->date('birth_date')->nullable()->after('phone');
            $table->enum('blood_type', ['A', 'B', 'AB', 'O'])->nullable()->after('birth_date');
            $table->enum('role', ['pendonor', 'petugas', 'admin'])->default('pendonor')->after('blood_type');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nik', 'phone', 'birth_date', 'blood_type', 'role']);
        });
    }
};
