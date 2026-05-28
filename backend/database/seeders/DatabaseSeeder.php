<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            LocationSeeder::class,
            UserSeeder::class,
            StockSeeder::class,
            ArticleSeeder::class,
            EventSeeder::class,
            DonorSeeder::class,
        ]);
    }
}
