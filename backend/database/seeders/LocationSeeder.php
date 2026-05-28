<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            [
                'name' => 'UTD PMI Kota Jakarta Pusat',
                'type' => 'unit_tetap',
                'address' => 'Jl. Abdul Muis No.66, Petojo Sel., Jakarta Pusat',
                'latitude' => -6.1690,
                'longitude' => 106.8135,
            ],
            [
                'name' => 'UTD PMI Kota Surabaya',
                'type' => 'unit_tetap',
                'address' => 'Jl. Embong Ploso No.I/5, Surabaya',
                'latitude' => -7.2575,
                'longitude' => 112.7521,
            ],
            [
                'name' => 'UTD PMI Kota Bandung',
                'type' => 'unit_tetap',
                'address' => 'Jl. Aceh No.53, Bandung',
                'latitude' => -6.9175,
                'longitude' => 107.6191,
            ],
            [
                'name' => 'UTD PMI Kota Yogyakarta',
                'type' => 'unit_tetap',
                'address' => 'Jl. Taman Siswa No.32, Yogyakarta',
                'latitude' => -7.8014,
                'longitude' => 110.3659,
            ],
            [
                'name' => 'UTD PMI Kota Medan',
                'type' => 'unit_tetap',
                'address' => 'Jl. Perintis Kemerdekaan No.37, Medan',
                'latitude' => 3.5952,
                'longitude' => 98.6722,
            ],
            [
                'name' => 'Unit Mobile PMI Jakarta Selatan',
                'type' => 'unit_mobile',
                'address' => 'Jl. Kebayoran Baru, Jakarta Selatan',
                'latitude' => -6.2382,
                'longitude' => 106.8066,
            ],
            [
                'name' => 'RS Dr. Cipto Mangunkusumo',
                'type' => 'rumah_sakit',
                'address' => 'Jl. Diponegoro No.71, Jakarta Pusat',
                'latitude' => -6.1935,
                'longitude' => 106.8478,
            ],
            [
                'name' => 'UTD PMI Kota Semarang',
                'type' => 'unit_tetap',
                'address' => 'Jl. Mgr. Soegijapranata No.32, Semarang',
                'latitude' => -6.9903,
                'longitude' => 110.4229,
            ],
            [
                'name' => 'UTD PMI Kota Makassar',
                'type' => 'unit_tetap',
                'address' => 'Jl. Jend. Sudirman No.1, Makassar',
                'latitude' => -5.1477,
                'longitude' => 119.4327,
            ],
            [
                'name' => 'UTD PMI Kota Palembang',
                'type' => 'unit_tetap',
                'address' => 'Jl. Merdeka No.15, Palembang',
                'latitude' => -2.9761,
                'longitude' => 104.7754,
            ],
        ];

        foreach ($locations as $location) {
            Location::create($location);
        }
    }
}
