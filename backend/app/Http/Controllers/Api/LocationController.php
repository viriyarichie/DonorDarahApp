<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\JsonResponse;

class LocationController extends Controller
{
    public function index(): JsonResponse
    {
        $locations = Location::withCount(['bookings', 'events'])->get();

        return response()->json([
            'data' => $locations->map(fn ($l) => [
                'id' => $l->id,
                'name' => $l->name,
                'type' => $l->type,
                'type_label' => $l->getTypeLabel(),
                'address' => $l->address,
                'latitude' => $l->latitude,
                'longitude' => $l->longitude,
            ]),
        ]);
    }

    public function show(Location $location): JsonResponse
    {
        $location->load(['stocks', 'events' => fn($q) => $q->upcoming()->limit(3)]);

        return response()->json([
            'data' => [
                'id' => $location->id,
                'name' => $location->name,
                'type' => $location->type,
                'type_label' => $location->getTypeLabel(),
                'address' => $location->address,
                'latitude' => $location->latitude,
                'longitude' => $location->longitude,
                'stocks' => $location->stocks,
                'upcoming_events' => $location->events,
            ],
        ]);
    }
}
