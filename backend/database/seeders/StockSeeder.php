<?php

namespace Database\Seeders;

use App\Models\Stock;
use Illuminate\Database\Seeder;

class StockSeeder extends Seeder
{
    public function run(): void
    {
        $bloodTypes = ['A', 'B', 'AB', 'O'];
        $locationIds = [1, 2, 3, 4, 5, 8, 9, 10];
        $amounts = [5, 8, 12, 15, 20, 25, 30, 35, 40, 50];

        foreach ($locationIds as $locationId) {
            foreach ($bloodTypes as $type) {
                Stock::create([
                    'blood_type' => $type,
                    'amount' => $amounts[array_rand($amounts)],
                    'location_id' => $locationId,
                ]);
            }
        }
    }
}
