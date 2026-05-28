<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            [
                'name' => 'Donor Darah Massal HUT PMI ke-79',
                'description' => 'Dalam rangka memperingati Hari Ulang Tahun PMI ke-79, kami mengadakan donor darah massal yang terbuka untuk seluruh masyarakat. Mari bergabung dan selamatkan nyawa!',
                'event_date' => now()->addDays(7)->setTime(8, 0),
                'quota' => 200,
                'location_id' => 1,
                'created_by' => 1,
            ],
            [
                'name' => 'Bakti Sosial Donor Darah Mall Central Park',
                'description' => 'Kegiatan donor darah yang bekerja sama dengan Mall Central Park Jakarta. Donor darah sambil berbelanja! Setiap pendonor mendapatkan voucher belanja senilai Rp50.000.',
                'event_date' => now()->addDays(14)->setTime(10, 0),
                'quota' => 100,
                'location_id' => 6,
                'created_by' => 2,
            ],
            [
                'name' => 'Donor Darah Kampus Universitas Indonesia',
                'description' => 'Bekerja sama dengan BEM Universitas Indonesia, PMI mengadakan kegiatan donor darah di kampus UI Depok. Terbuka untuk mahasiswa, dosen, dan staf UI.',
                'event_date' => now()->addDays(21)->setTime(9, 0),
                'quota' => 150,
                'location_id' => 2,
                'created_by' => 1,
            ],
            [
                'name' => 'Donor Darah Hari Palang Merah Sedunia',
                'description' => 'Memperingati Hari Palang Merah Sedunia, PMI mengajak seluruh masyarakat untuk berpartisipasi dalam kegiatan donor darah. Bersama kita bisa menyelamatkan lebih banyak nyawa.',
                'event_date' => now()->addDays(30)->setTime(8, 30),
                'quota' => 300,
                'location_id' => 3,
                'created_by' => 1,
            ],
            [
                'name' => 'Donor Darah Corporate PMI x Gojek',
                'description' => 'Program donor darah corporate yang bekerja sama dengan Gojek Indonesia. Kegiatan ini bertujuan untuk menumbuhkan budaya donor darah di lingkungan kerja.',
                'event_date' => now()->addDays(45)->setTime(9, 0),
                'quota' => 80,
                'location_id' => 4,
                'created_by' => 2,
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
