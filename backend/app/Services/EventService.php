<?php

namespace App\Services;

use App\Models\Event;
use App\Models\EventRegister;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class EventService
{
    public function getEvents(array $filters = [])
    {
        $query = Event::with(['location', 'creator'])
            ->withCount('eventRegisters');

        if (!empty($filters['upcoming'])) {
            $query->upcoming();
        }

        return $query->orderBy('event_date')->paginate(10);
    }

    public function registerForEvent(User $user, Event $event): EventRegister
    {
        // Hanya pendonor yang bisa mendaftar ke event
        if (!$user->isPendonor()) {
            throw ValidationException::withMessages([
                'event_id' => ['Hanya pendonor yang dapat mendaftar ke event donor.'],
            ]);
        }

        // Cek apakah sudah terdaftar
        $existing = EventRegister::where('user_id', $user->id)
            ->where('event_id', $event->id)
            ->first();

        if ($existing) {
            throw ValidationException::withMessages([
                'event_id' => ['Anda sudah terdaftar di event ini.'],
            ]);
        }

        // Cek kuota
        if ($event->event_registers_count >= $event->quota) {
            throw ValidationException::withMessages([
                'event_id' => ['Kuota event sudah penuh.'],
            ]);
        }

        $register = EventRegister::create([
            'user_id' => $user->id,
            'event_id' => $event->id,
            'registered_at' => now(),
            'status' => 'terdaftar',
        ]);

        Notification::create([
            'title' => 'Pendaftaran Event Berhasil',
            'message' => 'Anda berhasil mendaftar di event ' . $event->name . '.',
            'type' => 'event',
            'user_id' => $user->id,
        ]);

        return $register->load(['user', 'event']);
    }

    public function getEventParticipants(Event $event)
    {
        return $event->eventRegisters()->with('user')->orderBy('registered_at')->get();
    }

    public function createEvent(array $data, User $creator): Event
    {
        return Event::create([
            'name' => $data['name'],
            'description' => $data['description'],
            'event_date' => $data['event_date'],
            'quota' => $data['quota'] ?? 50,
            'location_id' => $data['location_id'],
            'created_by' => $creator->id,
        ])->load(['location', 'creator']);
    }

    public function updateEvent(Event $event, array $data): Event
    {
        $event->update($data);
        return $event->fresh(['location', 'creator']);
    }

    public function deleteEvent(Event $event): void
    {
        $event->delete();
    }
}
