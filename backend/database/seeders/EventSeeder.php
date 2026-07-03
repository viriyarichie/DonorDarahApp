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
                'name'        => 'Donor Darah Massal HUT PMI ke-79 Surabaya',
                'description' => 'Dalam rangka memperingati Hari Ulang Tahun PMI ke-79, UTD PMI Kota Surabaya mengadakan donor darah massal yang terbuka untuk seluruh warga Surabaya. Mari bergabung dan selamatkan nyawa! Setiap pendonor mendapatkan konsumsi dan merchandise PMI.',
                'event_date'  => now()->addDays(7)->setTime(8, 0),
                'quota'       => 200,
                'location_id' => 1, // UTD PMI Kota Surabaya
                'created_by'  => 1,
            ],
            [
                'name'        => 'Bakti Sosial Donor Darah – Galaxy Mall Surabaya',
                'description' => 'Kegiatan donor darah bekerja sama dengan Galaxy Mall Surabaya. Donor darah sambil berbelanja! Setiap pendonor mendapatkan voucher belanja senilai Rp50.000 dan makanan ringan gratis. Terbuka untuk umum.',
                'event_date'  => now()->addDays(14)->setTime(10, 0),
                'quota'       => 100,
                'location_id' => 10, // Unit Mobile Galaxy Mall
                'created_by'  => 2,
            ],
            [
                'name'        => 'Donor Darah ITS Surabaya – Gerak Mahasiswa',
                'description' => 'Bekerja sama dengan BEM ITS dan PMI Kota Surabaya, kegiatan donor darah kampus ini terbuka untuk mahasiswa, dosen, dan staf ITS. Bersama wujudkan kampus yang peduli sesama!',
                'event_date'  => now()->addDays(21)->setTime(9, 0),
                'quota'       => 150,
                'location_id' => 8, // Unit Mobile ITS
                'created_by'  => 1,
            ],
            [
                'name'        => 'Donor Darah Hari Palang Merah Sedunia – Surabaya',
                'description' => 'Memperingati Hari Palang Merah Sedunia, PMI Kota Surabaya mengajak seluruh warga Surabaya untuk berpartisipasi dalam kegiatan donor darah. Acara dipusatkan di RSUD Dr. Soetomo. Bersama kita selamatkan lebih banyak nyawa.',
                'event_date'  => now()->addDays(30)->setTime(8, 30),
                'quota'       => 300,
                'location_id' => 5, // RSUD Dr. Soetomo
                'created_by'  => 1,
            ],
            [
                'name'        => 'Donor Darah Universitas Airlangga Surabaya',
                'description' => 'Program donor darah kolaborasi PMI Kota Surabaya dengan BEM Universitas Airlangga. Terbuka untuk civitas akademika UNAIR dan masyarakat sekitar kampus. Tersedia pemeriksaan kesehatan gratis.',
                'event_date'  => now()->addDays(45)->setTime(9, 0),
                'quota'       => 120,
                'location_id' => 9, // Unit Mobile UNAIR
                'created_by'  => 2,
            ],
            [
                'name'        => 'Donor Darah Rutin – PMI Surabaya Selatan',
                'description' => 'Kegiatan donor darah rutin bulanan yang diselenggarakan oleh UDD PMI Surabaya Selatan. Tersedia layanan pemeriksaan hemoglobin, tensi darah, dan konsultasi kesehatan gratis bagi pendonor.',
                'event_date'  => now()->addDays(10)->setTime(8, 0),
                'quota'       => 80,
                'location_id' => 2, // UDD PMI Surabaya Selatan
                'created_by'  => 1,
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
