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

class DashboardController extends Controller
{
    public function __construct(private StockService $stockService) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isAdmin() || $user->isPetugas()) {
            return $this->adminDashboard();
        }

        return $this->pendonorDashboard($user);
    }

    private function adminDashboard(): JsonResponse
    {
        $totalDonors = Donor::where('donation_status', 'berhasil')->count();
        $totalUsers = User::where('role', 'pendonor')->count();
        $totalBookings = Booking::whereIn('status', ['menunggu', 'dikonfirmasi'])->count();
        $stockSummary = $this->stockService->getSummary();

        $recentDonors = Donor::with('user')
            ->where('donation_status', 'berhasil')
            ->orderByDesc('donation_date')
            ->limit(5)
            ->get()
            ->map(fn ($d) => [
                'name' => $d->user->name,
                'blood_type' => $d->user->blood_type,
                'date' => $d->donation_date->format('d/m/Y'),
            ]);

        $upcomingEvents = Event::with('location')
            ->upcoming()
            ->limit(3)
            ->get()
            ->map(fn ($e) => [
                'id' => $e->id,
                'name' => $e->name,
                'date' => $e->event_date->format('d/m/Y H:i'),
                'location' => $e->location->name,
            ]);

        // Aktivitas donor per bulan (6 bulan terakhir)
        $donorActivity = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $count = Donor::where('donation_status', 'berhasil')
                ->whereYear('donation_date', $month->year)
                ->whereMonth('donation_date', $month->month)
                ->count();
            $donorActivity[] = [
                'month' => $month->format('M Y'),
                'count' => $count,
            ];
        }

        return response()->json([
            'data' => [
                'stats' => [
                    'total_donors' => $totalDonors,
                    'total_users' => $totalUsers,
                    'total_bookings' => $totalBookings,
                ],
                'stock_summary' => $stockSummary,
                'recent_donors' => $recentDonors,
                'upcoming_events' => $upcomingEvents,
                'donor_activity' => $donorActivity,
            ],
        ]);
    }

    private function pendonorDashboard(User $user): JsonResponse
    {
        $totalDonor = $user->getDonorCount();
        $lastDonor = $user->donors()->where('donation_status', 'berhasil')->latest('donation_date')->first();
        $nextEligible = $lastDonor ? Carbon::parse($lastDonor->donation_date)->addMonths(3) : null;

        $activeBooking = $user->bookings()
            ->whereIn('status', ['menunggu', 'dikonfirmasi'])
            ->with('location')
            ->latest()
            ->first();

        $stockSummary = $this->stockService->getSummary();

        $upcomingEvents = Event::with('location')
            ->upcoming()
            ->limit(3)
            ->get()
            ->map(fn ($e) => [
                'id' => $e->id,
                'name' => $e->name,
                'date' => $e->event_date->format('d/m/Y H:i'),
                'location' => $e->location->name,
            ]);

        $milestones = [10, 25, 50, 75, 100];
        $nextMilestone = null;
        foreach ($milestones as $m) {
            if ($totalDonor < $m) {
                $nextMilestone = $m;
                break;
            }
        }

        return response()->json([
            'data' => [
                'total_donor' => $totalDonor,
                'last_donation_date' => $lastDonor?->donation_date,
                'next_eligible_date' => $nextEligible,
                'next_milestone' => $nextMilestone,
                'progress_to_next' => $nextMilestone ? round(($totalDonor / $nextMilestone) * 100, 1) : 100,
                'active_booking' => $activeBooking ? [
                    'id' => $activeBooking->id,
                    'date' => $activeBooking->booking_date->format('d/m/Y'),
                    'location' => $activeBooking->location->name,
                    'status' => $activeBooking->status,
                ] : null,
                'stock_summary' => $stockSummary,
                'upcoming_events' => $upcomingEvents,
            ],
        ]);
    }
}
