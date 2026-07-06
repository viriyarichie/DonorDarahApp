<?php

namespace App\Console\Commands;

use App\Services\NotificationService;
use Illuminate\Console\Command;

class SendDonorReminders extends Command
{
    protected $signature   = 'notify:donor-reminders';
    protected $description = 'Kirim notifikasi pengingat H-3 sebelum jadwal donor (booking & event)';

    public function __construct(private NotificationService $notificationService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $this->info('[' . now()->format('Y-m-d H:i:s') . '] Menjalankan pengingat H-3 donor...');

        [$bookingCount, $eventCount] = $this->notificationService->sendDonorReminders();

        $this->info("  → Booking reminder terkirim : {$bookingCount}");
        $this->info("  → Event reminder terkirim   : {$eventCount}");
        $this->info('Selesai.');

        return Command::SUCCESS;
    }
}
