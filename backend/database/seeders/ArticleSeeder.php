<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $articles = [
            [
                'title' => 'Manfaat Donor Darah bagi Kesehatan Pendonor',
                'content' => '<p>Donor darah bukan hanya bermanfaat bagi penerima darah, tetapi juga memberikan banyak manfaat kesehatan bagi pendonor itu sendiri. Berikut adalah beberapa manfaat utama dari donor darah secara rutin:</p>
<h2>1. Menjaga Kesehatan Jantung</h2>
<p>Donor darah secara rutin dapat membantu mengurangi kekentalan darah dan menurunkan risiko penyakit jantung. Darah yang lebih encer mengalir lebih lancar melalui pembuluh darah, mengurangi risiko penyumbatan.</p>
<h2>2. Membakar Kalori</h2>
<p>Proses donor darah dapat membakar sekitar 650 kalori. Tubuh bekerja keras untuk mengisi kembali darah yang hilang, yang membutuhkan energi tambahan.</p>
<h2>3. Mendapatkan Pemeriksaan Kesehatan Gratis</h2>
<p>Sebelum mendonorkan darah, pendonor akan menjalani serangkaian pemeriksaan kesehatan dasar, termasuk tekanan darah, hemoglobin, dan golongan darah.</p>
<h2>4. Mengurangi Risiko Kanker</h2>
<p>Beberapa penelitian menunjukkan bahwa donor darah secara teratur dapat membantu mengurangi kadar zat besi berlebih dalam tubuh, yang dikaitkan dengan risiko kanker yang lebih rendah.</p>',
                'published_at' => now()->subDays(5),
                'user_id' => 1,
            ],
            [
                'title' => 'Syarat-Syarat Menjadi Pendonor Darah PMI',
                'content' => '<p>Sebelum mendonorkan darah, ada beberapa syarat yang harus dipenuhi. Syarat-syarat ini diterapkan untuk menjaga keselamatan pendonor dan keamanan darah yang didonorkan.</p>
<h2>Syarat Umum</h2>
<ul>
<li>Usia minimal 17 tahun dan maksimal 60 tahun</li>
<li>Berat badan minimal 45 kg</li>
<li>Tekanan darah normal (sistolik 100-160 mmHg, diastolik 70-100 mmHg)</li>
<li>Kadar hemoglobin minimal 12,5 g/dL untuk perempuan dan 13 g/dL untuk laki-laki</li>
<li>Tidak sedang dalam kondisi sakit atau mengonsumsi obat-obatan tertentu</li>
</ul>
<h2>Interval Donor</h2>
<p>Pendonor dapat mendonorkan darah setiap 3 bulan sekali (minimal 56 hari atau 2 bulan untuk laki-laki). Interval ini diperlukan agar tubuh memiliki waktu yang cukup untuk memproduksi darah kembali.</p>
<h2>Kondisi yang Menunda Donor</h2>
<ul>
<li>Sedang hamil atau menyusui</li>
<li>Baru saja menjalani operasi</li>
<li>Sedang dalam pengobatan antibiotik</li>
<li>Baru sembuh dari penyakit tertentu</li>
</ul>',
                'published_at' => now()->subDays(10),
                'user_id' => 1,
            ],
            [
                'title' => 'Proses Donor Darah: Dari Pendaftaran hingga Selesai',
                'content' => '<p>Ingin tahu bagaimana proses donor darah berlangsung? Berikut adalah panduan lengkap yang akan membantu Anda memahami setiap tahap dalam proses donor darah.</p>
<h2>Tahap 1: Pendaftaran</h2>
<p>Pendonor mengisi formulir pendaftaran yang berisi data pribadi dan riwayat kesehatan. Formulir ini penting untuk memastikan keamanan proses donor.</p>
<h2>Tahap 2: Pemeriksaan Fisik</h2>
<p>Petugas PMI akan memeriksa tekanan darah, denyut nadi, suhu tubuh, dan kadar hemoglobin. Pemeriksaan ini berlangsung sekitar 10-15 menit.</p>
<h2>Tahap 3: Pengambilan Darah</h2>
<p>Proses pengambilan darah berlangsung sekitar 10-15 menit. Sebanyak 350-450 ml darah akan diambil menggunakan jarum dan kantong darah steril.</p>
<h2>Tahap 4: Istirahat dan Konsumsi</h2>
<p>Setelah mendonorkan darah, pendonor akan beristirahat selama 10-15 menit dan mendapatkan makanan dan minuman dari PMI.</p>
<h2>Tips Setelah Donor</h2>
<ul>
<li>Minum banyak air putih</li>
<li>Hindari aktivitas fisik berat selama 24 jam</li>
<li>Makan makanan bergizi tinggi zat besi</li>
</ul>',
                'published_at' => now()->subDays(15),
                'user_id' => 2,
            ],
            [
                'title' => 'Golongan Darah dan Kompatibilitasnya',
                'content' => '<p>Memahami golongan darah sangat penting dalam transfusi darah. Ada empat golongan darah utama dalam sistem ABO: A, B, AB, dan O.</p>
<h2>Golongan Darah A</h2>
<p>Orang dengan golongan darah A dapat menerima darah dari golongan A dan O. Mereka dapat mendonorkan darah ke golongan A dan AB.</p>
<h2>Golongan Darah B</h2>
<p>Orang dengan golongan darah B dapat menerima darah dari golongan B dan O. Mereka dapat mendonorkan darah ke golongan B dan AB.</p>
<h2>Golongan Darah AB</h2>
<p>Orang dengan golongan darah AB adalah penerima universal. Mereka dapat menerima darah dari semua golongan darah, tetapi hanya dapat mendonorkan ke sesama golongan AB.</p>
<h2>Golongan Darah O</h2>
<p>Orang dengan golongan darah O adalah pendonor universal. Mereka dapat mendonorkan darah ke semua golongan darah, tetapi hanya dapat menerima dari sesama golongan O.</p>',
                'published_at' => now()->subDays(20),
                'user_id' => 1,
            ],
            [
                'title' => 'Mitos dan Fakta tentang Donor Darah',
                'content' => '<p>Masih banyak mitos yang beredar tentang donor darah yang membuat orang ragu untuk mendonorkan darahnya. Mari kita luruskan beberapa mitos yang paling umum.</p>
<h2>Mitos 1: Donor darah menyebabkan badan lemah</h2>
<p><strong>Fakta:</strong> Tubuh manusia memiliki sekitar 5 liter darah. Dalam proses donor, hanya sekitar 350-450 ml yang diambil. Tubuh akan segera memproduksi sel darah merah baru dalam waktu 24-48 jam.</p>
<h2>Mitos 2: Donor darah menyebabkan ketagihan</h2>
<p><strong>Fakta:</strong> Donor darah tidak menyebabkan ketagihan secara medis. Perasaan ingin selalu berbagi mungkin ada, tapi itu adalah bentuk kepedulian sosial yang positif.</p>
<h2>Mitos 3: Donor darah bisa menularkan penyakit</h2>
<p><strong>Fakta:</strong> PMI menggunakan jarum dan kantong darah yang baru, steril, dan sekali pakai untuk setiap pendonor. Risiko penularan penyakit melalui donor darah sangat minimal.</p>
<h2>Mitos 4: Orang dengan tekanan darah tinggi tidak bisa donor</h2>
<p><strong>Fakta:</strong> Orang dengan tekanan darah terkontrol masih bisa mendonorkan darah, selama tekanan darahnya berada dalam rentang yang ditetapkan PMI.</p>',
                'published_at' => now()->subDays(25),
                'user_id' => 2,
            ],
        ];

        foreach ($articles as $article) {
            Article::create($article);
        }
    }
}
