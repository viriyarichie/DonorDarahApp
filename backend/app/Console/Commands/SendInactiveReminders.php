<?php

namespace App\Console\Commands;

use App\Services\NotificationService;
use Illuminate\Console\Command;

class SendInactiveReminders extends Command
{
    protected $signature   = 'notify:inactive-reminders';
    protected $description = 'Kirim notifikasi pengingat kepada pendonor yang sudah 3 bulan tidak donor';

    public function __construct(private NotificationService $notificationService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $this->info('[' . now()->format('Y-m-d H:i:s') . '] Menjalankan reminder pendonor tidak aktif...');

        $count = $this->notificationService->sendInactiveReminders();

        $this->info("  → Reminder terkirim ke {$count} pendonor.");
        $this->info('Selesai.');

        return Command::SUCCESS;
    }
}
