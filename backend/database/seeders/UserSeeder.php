<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'nik' => '3171000000000001',
            'name' => 'Admin PMI',
            'email' => 'admin@pmi.or.id',
            'phone' => '08100000001',
            'password' => Hash::make('password123'),
            'birth_date' => '1985-06-15',
            'blood_type' => 'A',
            'role' => 'admin',
        ]);

        // Petugas
        User::create([
            'nik' => '3171000000000002',
            'name' => 'Budi Santoso',
            'email' => 'petugas@pmi.or.id',
            'phone' => '08100000002',
            'password' => Hash::make('password123'),
            'birth_date' => '1990-03-20',
            'blood_type' => 'B',
            'role' => 'petugas',
        ]);

        // Pendonor
        $pendonors = [
            ['nik' => '3171010101010001', 'name' => 'Siti Rahayu', 'email' => 'siti@example.com', 'blood_type' => 'A', 'phone' => '08211111111'],
            ['nik' => '3171010101010002', 'name' => 'Ahmad Fauzi', 'email' => 'ahmad@example.com', 'blood_type' => 'B', 'phone' => '08211111112'],
            ['nik' => '3171010101010003', 'name' => 'Dewi Putri', 'email' => 'dewi@example.com', 'blood_type' => 'O', 'phone' => '08211111113'],
            ['nik' => '3171010101010004', 'name' => 'Rudi Hermawan', 'email' => 'rudi@example.com', 'blood_type' => 'AB', 'phone' => '08211111114'],
            ['nik' => '3171010101010005', 'name' => 'Ika Susanti', 'email' => 'ika@example.com', 'blood_type' => 'A', 'phone' => '08211111115'],
            ['nik' => '3171010101010006', 'name' => 'Wahyu Pratama', 'email' => 'wahyu@example.com', 'blood_type' => 'O', 'phone' => '08211111116'],
            ['nik' => '3171010101010007', 'name' => 'Novi Andriani', 'email' => 'novi@example.com', 'blood_type' => 'B', 'phone' => '08211111117'],
            ['nik' => '3171010101010008', 'name' => 'Dian Purnama', 'email' => 'dian@example.com', 'blood_type' => 'AB', 'phone' => '08211111118'],
            ['nik' => '3171010101010009', 'name' => 'Hendra Wijaya', 'email' => 'hendra@example.com', 'blood_type' => 'O', 'phone' => '08211111119'],
            ['nik' => '3171010101010010', 'name' => 'Rina Kartika', 'email' => 'rina@example.com', 'blood_type' => 'A', 'phone' => '08211111120'],
        ];

        foreach ($pendonors as $pendonor) {
            User::create(array_merge($pendonor, [
                'password' => Hash::make('password123'),
                'birth_date' => '1995-01-01',
                'role' => 'pendonor',
            ]));
        }
    }
}
