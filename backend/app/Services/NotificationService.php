<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
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
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'user_id' => $user->id,
        ]);
    }

    public function sendDonorReminders(): void
    {
        // Kirim reminder H-3 untuk booking
        $upcomingBookings = \App\Models\Booking::with('user')
            ->where('status', 'dikonfirmasi')
            ->whereDate('booking_date', now()->addDays(3)->toDateString())
            ->get();

        foreach ($upcomingBookings as $booking) {
            $this->createNotification(
                $booking->user,
                'Pengingat Donor Darah',
                'Anda memiliki jadwal donor darah 3 hari lagi pada tanggal ' . $booking->booking_date->format('d/m/Y') . '.',
                'reminder'
            );
        }
    }

    public function sendInactiveReminders(): void
    {
        // Kirim reminder untuk pendonor yang sudah 3 bulan tidak donor
        $threeMonthsAgo = now()->subMonths(3);

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
            $alreadyNotified = $user->notifications()
                ->where('type', 'reminder')
                ->where('title', 'Saatnya Donor Lagi!')
                ->whereDate('created_at', today())
                ->exists();

            if (!$alreadyNotified) {
                $this->createNotification(
                    $user,
                    'Saatnya Donor Lagi!',
                    'Sudah 3 bulan sejak donor terakhir Anda. Yuk, donor darah lagi dan selamatkan lebih banyak nyawa!',
                    'reminder'
                );
            }
        }
    }
}
