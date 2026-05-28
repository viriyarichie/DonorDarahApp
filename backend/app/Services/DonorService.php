<?php

namespace App\Services;

use App\Models\Condition;
use App\Models\Donor;
use App\Models\User;
use Carbon\Carbon;

class DonorService
{
    public function getDonorHistory(User $user)
    {
        return $user->donors()
            ->with('condition')
            ->orderByDesc('donation_date')
            ->paginate(10);
    }

    public function getDonorStats(User $user): array
    {
        $donors = $user->donors()->where('donation_status', 'berhasil')->get();
        $totalDonor = $donors->count();
        $lastDonor = $donors->sortByDesc('donation_date')->first();

        $nextEligible = null;
        if ($lastDonor) {
            $nextEligible = Carbon::parse($lastDonor->donation_date)->addMonths(3);
        }

        $nextMilestone = null;
        $milestones = [10, 25, 50, 75, 100];
        foreach ($milestones as $milestone) {
            if ($totalDonor < $milestone) {
                $nextMilestone = $milestone;
                break;
            }
        }

        return [
            'total_donor' => $totalDonor,
            'last_donation_date' => $lastDonor?->donation_date,
            'next_eligible_date' => $nextEligible,
            'next_milestone' => $nextMilestone,
            'progress_to_next' => $nextMilestone ? ($totalDonor / $nextMilestone) * 100 : 100,
        ];
    }

    public function addCondition(Donor $donor, array $data): Condition
    {
        return $donor->condition()->updateOrCreate(
            ['donor_id' => $donor->id],
            [
                'hemoglobin' => $data['hemoglobin'],
                'blood_pressure' => $data['blood_pressure'],
                'eligibility_status' => $data['eligibility_status'],
                'notes' => $data['notes'] ?? null,
            ]
        );
    }
}
