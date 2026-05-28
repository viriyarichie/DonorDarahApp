<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DonorResource;
use App\Models\Donor;
use App\Services\DonorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DonorController extends Controller
{
    public function __construct(private DonorService $donorService) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isPendonor()) {
            $donors = $this->donorService->getDonorHistory($user);
        } else {
            $donors = Donor::with(['user', 'condition'])
                ->orderByDesc('donation_date')
                ->paginate(10);
        }

        return response()->json([
            'data' => DonorResource::collection($donors),
            'meta' => [
                'current_page' => $donors->currentPage(),
                'last_page' => $donors->lastPage(),
                'total' => $donors->total(),
            ],
        ]);
    }

    public function show(Donor $donor): JsonResponse
    {
        return response()->json(['data' => new DonorResource($donor->load(['user', 'condition']))]);
    }

    public function stats(Request $request): JsonResponse
    {
        $stats = $this->donorService->getDonorStats($request->user());
        return response()->json(['data' => $stats]);
    }
}
