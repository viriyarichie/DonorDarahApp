<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Services\EventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function __construct(private EventService $eventService) {}

    public function index(Request $request): JsonResponse
    {
        $events = $this->eventService->getEvents($request->only(['upcoming']));

        return response()->json([
            'data' => EventResource::collection($events),
            'meta' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'total' => $events->total(),
            ],
        ]);
    }

    public function show(Event $event): JsonResponse
    {
        $event->loadCount('eventRegisters')->load(['location', 'creator']);
        return response()->json(['data' => new EventResource($event)]);
    }

    public function store(EventRequest $request): JsonResponse
    {
        $event = $this->eventService->createEvent($request->validated(), $request->user());
        return response()->json([
            'message' => 'Event berhasil dibuat.',
            'data' => new EventResource($event),
        ], 201);
    }

    public function update(EventRequest $request, Event $event): JsonResponse
    {
        $event = $this->eventService->updateEvent($event, $request->validated());
        return response()->json([
            'message' => 'Event berhasil diperbarui.',
            'data' => new EventResource($event),
        ]);
    }

    public function destroy(Event $event): JsonResponse
    {
        $this->eventService->deleteEvent($event);
        return response()->json(['message' => 'Event berhasil dihapus.']);
    }

    public function register(Request $request, Event $event): JsonResponse
    {
        $register = $this->eventService->registerForEvent($request->user(), $event);
        return response()->json([
            'message' => 'Pendaftaran event berhasil.',
            'data' => $register,
        ], 201);
    }
}
