<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        // Kirim reminder H-3 setiap hari jam 08:00
        $schedule->call(function () {
            app(\App\Services\NotificationService::class)->sendDonorReminders();
        })->dailyAt('08:00')->name('donor-reminders');

        // Kirim reminder pendonor tidak aktif setiap hari jam 09:00
        $schedule->call(function () {
            app(\App\Services\NotificationService::class)->sendInactiveReminders();
        })->dailyAt('09:00')->name('inactive-reminders');
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}
