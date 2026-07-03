<?php

namespace Database\Seeders;

use App\Models\Stock;
use Illuminate\Database\Seeder;

class StockSeeder extends Seeder
{
    public function run(): void
    {
        $bloodTypes = ['A', 'B', 'AB', 'O'];

        // Stok hanya untuk lokasi Surabaya (ID 1–10 sesuai LocationSeeder)
        // location_id 1: UTD PMI Kota Surabaya      → stok utama, harus lebih lengkap
        // location_id 2: UDD PMI Surabaya Selatan
        // location_id 3: Klinik PMI Surabaya Timur
        // location_id 4: Klinik PMI Surabaya Barat
        // location_id 5: RSUD Dr. Soetomo
        // location_id 6: RS Dr. Ramelan
        // location_id 7: RSUD Bhakti Dharma Husada
        // location_id 8: Unit Mobile ITS            → tidak punya stok permanen
        // location_id 9: Unit Mobile UNAIR           → tidak punya stok permanen
        // location_id 10: Unit Mobile Galaxy Mall    → tidak punya stok permanen

        $stocks = [
            // UTD PMI Kota Surabaya (stok terbesar – pusat)
            ['location_id' => 1, 'blood_type' => 'A',  'amount' => 45],
            ['location_id' => 1, 'blood_type' => 'B',  'amount' => 38],
            ['location_id' => 1, 'blood_type' => 'AB', 'amount' => 22],
            ['location_id' => 1, 'blood_type' => 'O',  'amount' => 60],

            // UDD PMI Surabaya Selatan
            ['location_id' => 2, 'blood_type' => 'A',  'amount' => 20],
            ['location_id' => 2, 'blood_type' => 'B',  'amount' => 15],
            ['location_id' => 2, 'blood_type' => 'AB', 'amount' => 8],
            ['location_id' => 2, 'blood_type' => 'O',  'amount' => 25],

            // Klinik PMI Surabaya Timur
            ['location_id' => 3, 'blood_type' => 'A',  'amount' => 12],
            ['location_id' => 3, 'blood_type' => 'B',  'amount' => 18],
            ['location_id' => 3, 'blood_type' => 'AB', 'amount' => 5],
            ['location_id' => 3, 'blood_type' => 'O',  'amount' => 30],

            // Klinik PMI Surabaya Barat
            ['location_id' => 4, 'blood_type' => 'A',  'amount' => 10],
            ['location_id' => 4, 'blood_type' => 'B',  'amount' => 8],
            ['location_id' => 4, 'blood_type' => 'AB', 'amount' => 3],
            ['location_id' => 4, 'blood_type' => 'O',  'amount' => 14],

            // RSUD Dr. Soetomo
            ['location_id' => 5, 'blood_type' => 'A',  'amount' => 35],
            ['location_id' => 5, 'blood_type' => 'B',  'amount' => 28],
            ['location_id' => 5, 'blood_type' => 'AB', 'amount' => 12],
            ['location_id' => 5, 'blood_type' => 'O',  'amount' => 50],

            // RS Dr. Ramelan
            ['location_id' => 6, 'blood_type' => 'A',  'amount' => 18],
            ['location_id' => 6, 'blood_type' => 'B',  'amount' => 22],
            ['location_id' => 6, 'blood_type' => 'AB', 'amount' => 7],
            ['location_id' => 6, 'blood_type' => 'O',  'amount' => 30],

            // RSUD Bhakti Dharma Husada
            ['location_id' => 7, 'blood_type' => 'A',  'amount' => 15],
            ['location_id' => 7, 'blood_type' => 'B',  'amount' => 10],
            ['location_id' => 7, 'blood_type' => 'AB', 'amount' => 4],
            ['location_id' => 7, 'blood_type' => 'O',  'amount' => 20],
        ];

        foreach ($stocks as $stock) {
            Stock::create($stock);
        }
    }
}
