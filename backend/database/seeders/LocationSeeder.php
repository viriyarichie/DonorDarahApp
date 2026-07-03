<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            // ── Unit Tetap UTD PMI Surabaya ──────────────────────────────
            [
                'name'      => 'UTD PMI Kota Surabaya',
                'type'      => 'unit_tetap',
                'address'   => 'Jl. Embong Ploso No.I/5, Genteng, Surabaya',
                'latitude'  => -7.2575,
                'longitude' => 112.7521,
            ],
            [
                'name'      => 'Unit Donor Darah PMI Surabaya Selatan',
                'type'      => 'unit_tetap',
                'address'   => 'Jl. Raya Waru No.12, Waru, Sidoarjo (melayani Surabaya Selatan)',
                'latitude'  => -7.3651,
                'longitude' => 112.7919,
            ],
            [
                'name'      => 'Klinik PMI Surabaya Timur',
                'type'      => 'unit_tetap',
                'address'   => 'Jl. Rungkut Industri Raya No.10, Rungkut, Surabaya',
                'latitude'  => -7.3228,
                'longitude' => 112.7870,
            ],
            [
                'name'      => 'Klinik PMI Surabaya Barat',
                'type'      => 'unit_tetap',
                'address'   => 'Jl. Babat Jerawat No.5, Pakal, Surabaya',
                'latitude'  => -7.2280,
                'longitude' => 112.6530,
            ],

            // ── Rumah Sakit mitra di Surabaya ────────────────────────────
            [
                'name'      => 'RSUD Dr. Soetomo Surabaya',
                'type'      => 'rumah_sakit',
                'address'   => 'Jl. Mayjen Prof. Dr. Moestopo No.6-8, Airlangga, Surabaya',
                'latitude'  => -7.2619,
                'longitude' => 112.7561,
            ],
            [
                'name'      => 'RS Dr. Ramelan Surabaya',
                'type'      => 'rumah_sakit',
                'address'   => 'Jl. Gadung No.1, Jagir, Wonokromo, Surabaya',
                'latitude'  => -7.3096,
                'longitude' => 112.7378,
            ],
            [
                'name'      => 'RSUD Bhakti Dharma Husada Surabaya',
                'type'      => 'rumah_sakit',
                'address'   => 'Jl. Raya Kendungsari No.115, Surabaya',
                'latitude'  => -7.3020,
                'longitude' => 112.7000,
            ],

            // ── Unit Mobile Surabaya ──────────────────────────────────────
            [
                'name'      => 'Unit Mobile PMI – ITS Surabaya',
                'type'      => 'unit_mobile',
                'address'   => 'Institut Teknologi Sepuluh Nopember, Sukolilo, Surabaya',
                'latitude'  => -7.2822,
                'longitude' => 112.7960,
            ],
            [
                'name'      => 'Unit Mobile PMI – Universitas Airlangga',
                'type'      => 'unit_mobile',
                'address'   => 'Kampus B UNAIR, Jl. Dharmawangsa Dalam, Surabaya',
                'latitude'  => -7.2767,
                'longitude' => 112.7638,
            ],
            [
                'name'      => 'Unit Mobile PMI – Galaxy Mall Surabaya',
                'type'      => 'unit_mobile',
                'address'   => 'Galaxy Mall, Jl. Dharmahusada Indah Tim. No.37, Surabaya',
                'latitude'  => -7.2697,
                'longitude' => 112.7814,
            ],
        ];

        foreach ($locations as $location) {
            Location::create($location);
        }
    }
}
