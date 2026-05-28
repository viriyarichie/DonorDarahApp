<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(private BookingService $bookingService) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Booking::with(['location', 'user', 'donor'])
            ->orderByDesc('booking_date');

        if ($user->isPendonor()) {
            $query->where('user_id', $user->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $bookings = $query->paginate(10);

        return response()->json([
            'data' => BookingResource::collection($bookings),
            'meta' => [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
                'total' => $bookings->total(),
            ],
        ]);
    }

    public function store(BookingRequest $request): JsonResponse
    {
        $booking = $this->bookingService->createBooking($request->user(), $request->validated());

        return response()->json([
            'message' => 'Booking donor berhasil dibuat.',
            'data' => new BookingResource($booking),
        ], 201);
    }

    public function show(Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);
        return response()->json(['data' => new BookingResource($booking->load(['location', 'user', 'donor']))]);
    }

    public function confirm(Booking $booking): JsonResponse
    {
        $booking = $this->bookingService->confirmBooking($booking);
        return response()->json([
            'message' => 'Booking berhasil dikonfirmasi.',
            'data' => new BookingResource($booking),
        ]);
    }

    public function complete(Booking $booking): JsonResponse
    {
        $booking = $this->bookingService->completeBooking($booking);
        return response()->json([
            'message' => 'Donor berhasil diselesaikan.',
            'data' => new BookingResource($booking),
        ]);
    }

    public function cancel(Booking $booking): JsonResponse
    {
        $booking = $this->bookingService->cancelBooking($booking);
        return response()->json([
            'message' => 'Booking berhasil dibatalkan.',
            'data' => new BookingResource($booking),
        ]);
    }
}
