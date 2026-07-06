<?php

namespace App\Console;

use App\Console\Commands\SendDonorReminders;
use App\Console\Commands\SendInactiveReminders;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Jadwal scheduler – dijalankan via Windows Task Scheduler setiap menit:
     *   php artisan schedule:run
     *
     * Atau jalankan manual:
     *   php artisan notify:donor-reminders
     *   php artisan notify:inactive-reminders
     */
    protected function schedule(Schedule $schedule): void
    {
        // Kirim reminder H-3 setiap hari jam 08:00
        $schedule->command(SendDonorReminders::class)
            ->dailyAt('08:00')
            ->withoutOverlapping()
            ->appendOutputTo(storage_path('logs/scheduler.log'));

        // Kirim reminder pendonor tidak aktif setiap hari jam 09:00
        $schedule->command(SendInactiveReminders::class)
            ->dailyAt('09:00')
            ->withoutOverlapping()
            ->appendOutputTo(storage_path('logs/scheduler.log'));
    }

    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');
        require base_path('routes/console.php');
    }
}
