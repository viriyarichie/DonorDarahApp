<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Donor;
use App\Models\Event;
use App\Models\Stock;
use App\Models\User;
use App\Services\StockService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __construct(private StockService $stockService) {}

    public function index(Request $request): JsonResponse
    {
        $period = $request->query('period', '1m');
        $user = $request->user();

        if ($user->isAdmin() || $user->isPetugas()) {
            return $this->adminDashboard($period);
        }

        return $this->pendonorDashboard($user, $period);
    }

    private function getDonorActivity(string $period): array
    {
        // Parse period
        if (str_starts_with($period, 'year:')) {
            $year = (int) substr($period, 5);
            return $this->getByYear($year);
        }

        return match ($period) {
            '1m'  => $this->getLast30Days(),
            '6m'  => $this->getLastNMonths(6),
            '1y'  => $this->getLastNMonths(12),
            default => $this->getLast30Days(),
        };
    }

    private function getLast30Days(): array
    {
        $rows = DB::table('donors')
            ->select(DB::raw("DATE(donation_date) as date, COUNT(*) as count"))
            ->where('donation_status', 'berhasil')
            ->where('donation_date', '>=', Carbon::now()->subDays(29)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $result = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->toDateString();
            $result[] = [
                'label' => Carbon::parse($date)->format('d/m'),
                'count' => $rows[$date]->count ?? 0,
            ];
        }
        return $result;
    }

    private function getLastNMonths(int $n): array
    {
        $rows = DB::table('donors')
            ->select(DB::raw("DATE_FORMAT(donation_date, '%Y-%m') as month, COUNT(*) as count"))
            ->where('donation_status', 'berhasil')
            ->where('donation_date', '>=', Carbon::now()->subMonths($n - 1)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        $result = [];
        for ($i = $n - 1; $i >= 0; $i--) {
            $key = Carbon::now()->subMonths($i)->format('Y-m');
            $result[] = [
                'label' => Carbon::parse($key . '-01')->translatedFormat('M Y'),
                'count' => $rows[$key]->count ?? 0,
            ];
        }
        return $result;
    }

    private function getByYear(int $year): array
    {
        $rows = DB::table('donors')
            ->select(DB::raw("MONTH(donation_date) as month_num, COUNT(*) as count"))
            ->where('donation_status', 'berhasil')
            ->whereYear('donation_date', $year)
            ->groupBy('month_num')
            ->orderBy('month_num')
            ->get()
            ->keyBy('month_num');

        $result = [];
        for ($m = 1; $m <= 12; $m++) {
            $result[] = [
                'label' => Carbon::createFromDate($year, $m, 1)->translatedFormat('M'),
                'count' => $rows[$m]->count ?? 0,
            ];
        }
        return $result;
    }

    private function adminDashboard(string $period = '1m'): JsonResponse
    {
        $totalDonors    = Donor::where('donation_status', 'berhasil')->count();
        $totalUsers     = User::where('role', 'pendonor')->count();
        $totalBookings  = Booking::whereIn('status', ['menunggu', 'dikonfirmasi'])->count();
        $stockSummary   = $this->stockService->getSummary();

        $recentDonors = Donor::with('user')
            ->where('donation_status', 'berhasil')
            ->orderByDesc('donation_date')
            ->limit(5)
            ->get()
            ->map(fn($d) => [
                'name'       => $d->user->name,
                'blood_type' => $d->user->blood_type,
                'date'       => $d->donation_date->format('d/m/Y'),
            ]);

        $upcomingEvents = Event::with('location')
            ->upcoming()
            ->limit(3)
            ->get()
            ->map(fn($e) => [
                'id'       => $e->id,
                'name'     => $e->name,
                'date'     => $e->event_date->format('d/m/Y H:i'),
                'location' => $e->location->name,
            ]);

        // ← use shared helper instead of hardcoded loop
        $donorActivity = $this->getDonorActivity($period);

        return response()->json([
            'data' => [
                'stats' => [
                    'total_donors'   => $totalDonors,
                    'total_users'    => $totalUsers,
                    'total_bookings' => $totalBookings,
                ],
                'stock_summary'  => $stockSummary,
                'recent_donors'  => $recentDonors,
                'upcoming_events' => $upcomingEvents,
                'donor_activity' => $donorActivity,
            ],
        ]);
    }

    private function pendonorDashboard(User $user, string $period = '1m'): JsonResponse
    {
        $totalDonor   = $user->getDonorCount();
        $lastDonor    = $user->donors()->where('donation_status', 'berhasil')->latest('donation_date')->first();
        $nextEligible = $lastDonor ? Carbon::parse($lastDonor->donation_date)->addMonths(3) : null;

        $activeBooking = $user->bookings()
            ->whereIn('status', ['menunggu', 'dikonfirmasi'])
            ->with('location')
            ->latest()
            ->first();

        // Pendaftaran event yang masih akan datang (event belum lewat, status terdaftar)
        $activeEventRegistrations = $user->eventRegisters()
            ->with(['event.location'])
            ->whereHas('event', fn($q) => $q->where('event_date', '>', Carbon::now()))
            ->where('status', 'terdaftar')
            ->orderBy(
                Event::select('event_date')
                    ->whereColumn('events.id', 'event_registers.event_id')
                    ->limit(1)
            )
            ->get()
            ->map(fn($r) => [
                'id'                   => $r->id,
                'event_id'             => $r->event->id,
                'name'                 => $r->event->name,
                'date'                 => $r->event->event_date->format('d/m/Y H:i'),
                'location'             => $r->event->location?->name ?? '-',
                'status'               => $r->status,
                'type'                 => 'event',
            ]);

        $stockSummary   = $this->stockService->getSummary();
        $upcomingEvents = Event::with('location')
            ->upcoming()
            ->limit(3)
            ->get()
            ->map(fn($e) => [
                'id'       => $e->id,
                'name'     => $e->name,
                'date'     => $e->event_date->format('d/m/Y H:i'),
                'location' => $e->location->name,
            ]);

        $milestones    = [10, 25, 50, 75, 100];
        $nextMilestone = null;
        foreach ($milestones as $m) {
            if ($totalDonor < $m) {
                $nextMilestone = $m;
                break;
            }
        }

        $donorActivity = $this->getDonorActivity($period);

        return response()->json([
            'data' => [
                'total_donor'               => $totalDonor,
                'last_donation_date'        => $lastDonor?->donation_date,
                'next_eligible_date'        => $nextEligible,
                'next_milestone'            => $nextMilestone,
                'progress_to_next'          => $nextMilestone ? round(($totalDonor / $nextMilestone) * 100, 1) : 100,
                'active_booking'            => $activeBooking ? [
                    'id'       => $activeBooking->id,
                    'date'     => $activeBooking->booking_date->format('d/m/Y'),
                    'location' => $activeBooking->location->name,
                    'status'   => $activeBooking->status,
                    'type'     => 'booking',
                ] : null,
                'active_event_registrations' => $activeEventRegistrations,
                'stock_summary'             => $stockSummary,
                'upcoming_events'           => $upcomingEvents,
                'donor_activity'            => $donorActivity,
            ],
        ]);
    }
}
