<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Donor;
use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class BookingService
{
    public function createBooking(User $user, array $data): Booking
    {
        // Cek interval 3 bulan
        $lastDonor = $user->donors()
            ->where('donation_status', 'berhasil')
            ->latest('donation_date')
            ->first();

        if ($lastDonor) {
            $nextEligible = Carbon::parse($lastDonor->donation_date)->addMonths(3);
            if (Carbon::parse($data['booking_date'])->lt($nextEligible)) {
                throw ValidationException::withMessages([
                    'booking_date' => [
                        'Anda belum bisa donor. Minimal 3 bulan setelah donor terakhir. '
                        . 'Tanggal minimal: ' . $nextEligible->format('d/m/Y')
                    ],
                ]);
            }
        }

        // Cek duplikasi booking
        $existingBooking = Booking::where('user_id', $user->id)
            ->whereIn('status', ['menunggu', 'dikonfirmasi'])
            ->first();

        if ($existingBooking) {
            throw ValidationException::withMessages([
                'booking_date' => ['Anda masih memiliki booking yang aktif.'],
            ]);
        }

        $booking = Booking::create([
            'user_id' => $user->id,
            'location_id' => $data['location_id'],
            'booking_date' => $data['booking_date'],
            'status' => 'menunggu',
            'notes' => $data['notes'] ?? null,
        ]);

        // Kirim notifikasi
        Notification::create([
            'title' => 'Booking Donor Berhasil',
            'message' => 'Booking donor Anda pada tanggal ' . Carbon::parse($data['booking_date'])->format('d/m/Y') . ' telah berhasil dibuat.',
            'type' => 'umum',
            'user_id' => $user->id,
        ]);

        return $booking->load(['location', 'user']);
    }

    public function confirmBooking(Booking $booking): Booking
    {
        $booking->update(['status' => 'dikonfirmasi']);

        Notification::create([
            'title' => 'Booking Dikonfirmasi',
            'message' => 'Booking donor Anda telah dikonfirmasi oleh petugas PMI.',
            'type' => 'umum',
            'user_id' => $booking->user_id,
        ]);

        return $booking->fresh(['location', 'user']);
    }

    public function completeBooking(Booking $booking): Booking
    {
        $donor = Donor::create([
            'donation_date' => $booking->booking_date,
            'donation_status' => 'berhasil',
            'user_id' => $booking->user_id,
        ]);

        $booking->update([
            'status' => 'selesai',
            'donor_id' => $donor->id,
        ]);

        // Cek milestone penghargaan
        $donorCount = $booking->user->getDonorCount();
        $milestones = [10, 25, 50, 75, 100];

        if (in_array($donorCount, $milestones)) {
            Notification::create([
                'title' => 'Selamat! Milestone Tercapai',
                'message' => "Anda telah mencapai {$donorCount} kali donor! Ajukan sertifikat penghargaan Anda.",
                'type' => 'penghargaan',
                'user_id' => $booking->user_id,
            ]);
        }

        Notification::create([
            'title' => 'Donor Selesai',
            'message' => 'Terima kasih telah mendonorkan darah. Semoga kebaikan Anda bermanfaat bagi banyak orang.',
            'type' => 'umum',
            'user_id' => $booking->user_id,
        ]);

        return $booking->fresh(['location', 'user', 'donor']);
    }

    public function cancelBooking(Booking $booking): Booking
    {
        $booking->update(['status' => 'dibatalkan']);

        Notification::create([
            'title' => 'Booking Dibatalkan',
            'message' => 'Booking donor Anda telah dibatalkan.',
            'type' => 'umum',
            'user_id' => $booking->user_id,
        ]);

        return $booking->fresh();
    }
}
