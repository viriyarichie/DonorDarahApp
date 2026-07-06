<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\EventRegister;
use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;

class NotificationService
{
    // ─── Read helpers ────────────────────────────────────────────────────────

    public function getUserNotifications(User $user)
    {
        return $user->notifications()
            ->orderByDesc('created_at')
            ->paginate(20);
    }

    public function markAsRead(Notification $notification): Notification
    {
        $notification->update(['is_read' => true]);
        return $notification;
    }

    public function markAllAsRead(User $user): void
    {
        $user->notifications()->unread()->update(['is_read' => true]);
    }

    public function getUnreadCount(User $user): int
    {
        return $user->notifications()->unread()->count();
    }

    public function createNotification(User $user, string $title, string $message, string $type = 'umum'): Notification
    {
        return Notification::create([
            'title'   => $title,
            'message' => $message,
            'type'    => $type,
            'user_id' => $user->id,
        ]);
    }

    // ─── On-demand check (dipanggil saat pendonor buka dashboard) ────────────

    /**
     * Cek dan kirim semua reminder yang relevan untuk pendonor tertentu.
     * Dipanggil otomatis tiap kali pendonor membuka dashboard.
     * Setiap jenis notifikasi hanya terkirim sekali per hari (dedup by date).
     */
    public function checkAndSendReminders(User $user): void
    {
        $this->checkH3BookingReminder($user);
        $this->checkH3EventReminder($user);
        $this->checkInactiveReminder($user);
    }

    /**
     * Reminder H-3 untuk booking donor reguler (status: menunggu / dikonfirmasi).
     */
    private function checkH3BookingReminder(User $user): void
    {
        $targetDate = Carbon::now()->addDays(3)->toDateString();

        $bookings = Booking::where('user_id', $user->id)
            ->whereIn('status', ['menunggu', 'dikonfirmasi'])
            ->whereDate('booking_date', $targetDate)
            ->get();

        foreach ($bookings as $booking) {
            $alreadySent = $user->notifications()
                ->where('type', 'reminder')
                ->where('title', 'Pengingat Donor Darah – H-3')
                ->whereDate('created_at', today())
                ->exists();

            if ($alreadySent) {
                continue;
            }

            $this->createNotification(
                $user,
                'Pengingat Donor Darah – H-3',
                'Anda memiliki jadwal donor darah 3 hari lagi pada tanggal '
                    . $booking->booking_date->format('d/m/Y')
                    . '. Pastikan kondisi tubuh Anda sehat sebelum donor!',
                'reminder'
            );
        }
    }

    /**
     * Reminder H-3 untuk event donor yang sudah didaftarkan (status: terdaftar).
     */
    private function checkH3EventReminder(User $user): void
    {
        $targetDate = Carbon::now()->addDays(3)->toDateString();

        $eventRegisters = EventRegister::where('user_id', $user->id)
            ->where('status', 'terdaftar')
            ->whereHas('event', fn($q) => $q->whereDate('event_date', $targetDate))
            ->with('event')
            ->get();

        foreach ($eventRegisters as $reg) {
            $alreadySent = $user->notifications()
                ->where('type', 'reminder')
                ->where('title', 'Pengingat Event Donor – H-3')
                ->whereDate('created_at', today())
                ->exists();

            if ($alreadySent) {
                continue;
            }

            $this->createNotification(
                $user,
                'Pengingat Event Donor – H-3',
                'Anda terdaftar di event "' . $reg->event->name . '" yang akan berlangsung 3 hari lagi pada '
                    . $reg->event->event_date->format('d/m/Y H:i')
                    . '. Pastikan Anda hadir!',
                'reminder'
            );
        }
    }

    /**
     * Reminder jika pendonor sudah >= 3 bulan tidak melakukan donor.
     * Hanya dikirim sekali per hari.
     */
    private function checkInactiveReminder(User $user): void
    {
        $threeMonthsAgo = Carbon::now()->subMonths(3);

        // Punya donor berhasil, tapi semuanya lebih dari 3 bulan yang lalu
        $hasOldDonor = $user->donors()
            ->where('donation_status', 'berhasil')
            ->where('donation_date', '<', $threeMonthsAgo)
            ->exists();

        $hasRecentDonor = $user->donors()
            ->where('donation_status', 'berhasil')
            ->where('donation_date', '>=', $threeMonthsAgo)
            ->exists();

        if (!$hasOldDonor || $hasRecentDonor) {
            return; // Belum pernah donor, atau donor terakhir < 3 bulan
        }

        // Jangan kirim dobel dalam sehari
        $alreadySent = $user->notifications()
            ->where('type', 'reminder')
            ->where('title', 'Saatnya Donor Lagi!')
            ->whereDate('created_at', today())
            ->exists();

        if ($alreadySent) {
            return;
        }

        $lastDonor = $user->donors()
            ->where('donation_status', 'berhasil')
            ->latest('donation_date')
            ->first();

        $lastDateStr = $lastDonor
            ? $lastDonor->donation_date->format('d/m/Y')
            : '-';

        $this->createNotification(
            $user,
            'Saatnya Donor Lagi!',
            'Anda terakhir mendonorkan darah pada ' . $lastDateStr
                . '. Sudah lebih dari 3 bulan berlalu — yuk, donor darah lagi dan selamatkan lebih banyak nyawa di Surabaya!',
            'reminder'
        );
    }

    // ─── Batch jobs (untuk Artisan command / scheduler opsional) ─────────────

    /**
     * Kirim H-3 reminder ke semua pendonor yang relevan (batch).
     * @return array{int, int} [$bookingCount, $eventCount]
     */
    public function sendDonorReminders(): array
    {
        $targetDate = Carbon::now()->addDays(3)->toDateString();
        $bookingCount = 0;
        $eventCount   = 0;

        $bookings = Booking::with('user')
            ->whereIn('status', ['menunggu', 'dikonfirmasi'])
            ->whereDate('booking_date', $targetDate)
            ->get();

        foreach ($bookings as $booking) {
            $alreadySent = $booking->user->notifications()
                ->where('type', 'reminder')
                ->where('title', 'Pengingat Donor Darah – H-3')
                ->whereDate('created_at', today())
                ->exists();

            if ($alreadySent) continue;

            $this->createNotification(
                $booking->user,
                'Pengingat Donor Darah – H-3',
                'Anda memiliki jadwal donor darah 3 hari lagi pada tanggal '
                    . $booking->booking_date->format('d/m/Y')
                    . '. Pastikan kondisi tubuh Anda sehat sebelum donor!',
                'reminder'
            );
            $bookingCount++;
        }

        $eventRegisters = EventRegister::with(['user', 'event'])
            ->where('status', 'terdaftar')
            ->whereHas('event', fn($q) => $q->whereDate('event_date', $targetDate))
            ->get();

        foreach ($eventRegisters as $reg) {
            $alreadySent = $reg->user->notifications()
                ->where('type', 'reminder')
                ->where('title', 'Pengingat Event Donor – H-3')
                ->whereDate('created_at', today())
                ->exists();

            if ($alreadySent) continue;

            $this->createNotification(
                $reg->user,
                'Pengingat Event Donor – H-3',
                'Anda terdaftar di event "' . $reg->event->name . '" yang akan berlangsung 3 hari lagi pada '
                    . $reg->event->event_date->format('d/m/Y H:i')
                    . '. Pastikan Anda hadir!',
                'reminder'
            );
            $eventCount++;
        }

        return [$bookingCount, $eventCount];
    }

    /**
     * Kirim reminder 3-bulan tidak aktif ke semua pendonor (batch).
     * @return int jumlah notifikasi terkirim
     */
    public function sendInactiveReminders(): int
    {
        $threeMonthsAgo = Carbon::now()->subMonths(3);
        $count = 0;

        $users = User::where('role', 'pendonor')
            ->whereHas('donors', function ($q) use ($threeMonthsAgo) {
                $q->where('donation_status', 'berhasil')
                    ->where('donation_date', '<', $threeMonthsAgo);
            })
            ->whereDoesntHave('donors', function ($q) use ($threeMonthsAgo) {
                $q->where('donation_status', 'berhasil')
                    ->where('donation_date', '>=', $threeMonthsAgo);
            })
            ->get();

        foreach ($users as $user) {
            $alreadySent = $user->notifications()
                ->where('type', 'reminder')
                ->where('title', 'Saatnya Donor Lagi!')
                ->whereDate('created_at', today())
                ->exists();

            if ($alreadySent) continue;

            $lastDonor = $user->donors()
                ->where('donation_status', 'berhasil')
                ->latest('donation_date')
                ->first();

            $lastDateStr = $lastDonor ? $lastDonor->donation_date->format('d/m/Y') : '-';

            $this->createNotification(
                $user,
                'Saatnya Donor Lagi!',
                'Anda terakhir mendonorkan darah pada ' . $lastDateStr
                    . '. Sudah lebih dari 3 bulan berlalu — yuk, donor darah lagi dan selamatkan lebih banyak nyawa di Surabaya!',
                'reminder'
            );
            $count++;
        }

        return $count;
    }
}
