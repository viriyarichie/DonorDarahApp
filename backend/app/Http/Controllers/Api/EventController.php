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
                'last_page'    => $events->lastPage(),
                'total'        => $events->total(),
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
            'data'    => new EventResource($event),
        ], 201);
    }

    public function update(EventRequest $request, Event $event): JsonResponse
    {
        $event = $this->eventService->updateEvent($event, $request->validated());
        return response()->json([
            'message' => 'Event berhasil diperbarui.',
            'data'    => new EventResource($event),
        ]);
    }

    public function destroy(Event $event): JsonResponse
    {
        $this->eventService->deleteEvent($event);
        return response()->json(['message' => 'Event berhasil dihapus.']);
    }

    /** Pendonor mendaftar ke event */
    public function register(Request $request, Event $event): JsonResponse
    {
        $register = $this->eventService->registerForEvent($request->user(), $event);
        return response()->json([
            'message' => 'Pendaftaran event berhasil.',
            'data'    => $register,
        ], 201);
    }

    /** Daftar event yang sudah didaftarkan oleh pendonor yang login */
    public function myRegistrations(Request $request): JsonResponse
    {
        $registrations = $request->user()
            ->eventRegisters()
            ->with(['event.location'])
            ->orderByDesc('registered_at')
            ->get()
            ->map(fn($r) => [
                'id'            => $r->id,
                'status'        => $r->status,
                'registered_at' => $r->registered_at?->format('d/m/Y H:i'),
                'event'         => [
                    'id'                   => $r->event->id,
                    'name'                 => $r->event->name,
                    'event_date'           => $r->event->event_date?->format('Y-m-d H:i:s'),
                    'event_date_formatted' => $r->event->event_date?->format('d/m/Y H:i'),
                    'location'             => $r->event->location ? [
                        'name'    => $r->event->location->name,
                        'address' => $r->event->location->address,
                    ] : null,
                ],
            ]);

        return response()->json(['data' => $registrations]);
    }

    /** Daftar peserta yang terdaftar di suatu event (untuk petugas & admin) */
    public function participants(Event $event): JsonResponse
    {
        $event->loadCount('eventRegisters');
        $participants = $this->eventService->getEventParticipants($event);

        return response()->json([
            'data'  => $participants->map(fn($r) => [
                'id'            => $r->id,
                'status'        => $r->status,
                'registered_at' => $r->registered_at?->format('d/m/Y H:i'),
                'user'          => [
                    'id'         => $r->user->id,
                    'name'       => $r->user->name,
                    'email'      => $r->user->email,
                    'blood_type' => $r->user->blood_type,
                    'phone'      => $r->user->phone,
                ],
            ]),
            'event' => [
                'id'                   => $event->id,
                'name'                 => $event->name,
                'event_date_formatted' => $event->event_date?->format('d/m/Y H:i'),
                'quota'                => $event->quota,
                'registered_count'     => $event->event_registers_count,
            ],
        ]);
    }
}
