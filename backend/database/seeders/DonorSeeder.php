<?php

namespace Database\Seeders;

use App\Models\Condition;
use App\Models\Donor;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DonorSeeder extends Seeder
{
    public function run(): void
    {
        // Tambahkan riwayat donor untuk beberapa pendonor
        $donorData = [
            ['user_id' => 3, 'count' => 12], // Siti Rahayu - 12 kali donor
            ['user_id' => 4, 'count' => 27], // Ahmad Fauzi - 27 kali donor
            ['user_id' => 5, 'count' => 5],  // Dewi Putri - 5 kali
            ['user_id' => 6, 'count' => 52], // Rudi Hermawan - 52 kali
            ['user_id' => 7, 'count' => 3],  // Ika Susanti - 3 kali
        ];

        foreach ($donorData as $data) {
            for ($i = $data['count']; $i >= 1; $i--) {
                $donationDate = Carbon::now()->subMonths($i * 3);

                $donor = Donor::create([
                    'user_id' => $data['user_id'],
                    'donation_date' => $donationDate->toDateString(),
                    'donation_status' => 'berhasil',
                ]);

                // Tambah kondisi untuk setiap donor
                Condition::create([
                    'donor_id' => $donor->id,
                    'hemoglobin' => rand(125, 175) / 10,
                    'blood_pressure' => (rand(100, 130)) . '/' . (rand(70, 90)),
                    'eligibility_status' => 'layak',
                    'notes' => 'Kondisi pendonor baik.',
                ]);
            }
        }
    }
}
