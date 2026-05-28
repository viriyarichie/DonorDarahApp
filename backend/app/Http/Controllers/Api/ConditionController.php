<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ConditionResource;
use App\Models\Condition;
use App\Models\Donor;
use App\Services\DonorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConditionController extends Controller
{
    public function __construct(private DonorService $donorService) {}

    public function store(Request $request, Donor $donor): JsonResponse
    {
        $request->validate([
            'hemoglobin' => 'required|numeric|min:5|max:25',
            'blood_pressure' => 'required|string|max:20',
            'eligibility_status' => 'required|in:layak,tidak_layak,ditunda',
            'notes' => 'nullable|string|max:500',
        ], [
            'hemoglobin.required' => 'Hemoglobin wajib diisi.',
            'hemoglobin.numeric' => 'Hemoglobin harus berupa angka.',
            'blood_pressure.required' => 'Tekanan darah wajib diisi.',
            'eligibility_status.required' => 'Status kelayakan wajib diisi.',
            'eligibility_status.in' => 'Status kelayakan tidak valid.',
        ]);

        $condition = $this->donorService->addCondition($donor, $request->all());

        return response()->json([
            'message' => 'Data kondisi berhasil disimpan.',
            'data' => new ConditionResource($condition),
        ], 201);
    }

    public function show(Donor $donor): JsonResponse
    {
        $condition = $donor->condition;

        if (!$condition) {
            return response()->json(['message' => 'Data kondisi belum tersedia.'], 404);
        }

        return response()->json(['data' => new ConditionResource($condition)]);
    }

    public function myLatest(Request $request): JsonResponse
    {
        $lastDonor = $request->user()
            ->donors()
            ->with('condition')
            ->where('donation_status', 'berhasil')
            ->latest('donation_date')
            ->first();

        if (!$lastDonor || !$lastDonor->condition) {
            return response()->json(['message' => 'Belum ada data kondisi darah.'], 404);
        }

        return response()->json(['data' => new ConditionResource($lastDonor->condition)]);
    }
}
