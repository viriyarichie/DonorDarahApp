<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(private NotificationService $notificationService) {}

    public function index(Request $request): JsonResponse
    {
        $notifications = $this->notificationService->getUserNotifications($request->user());
        $unreadCount = $this->notificationService->getUnreadCount($request->user());

        return response()->json([
            'data' => NotificationResource::collection($notifications),
            'unread_count' => $unreadCount,
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    public function markAsRead(Notification $notification): JsonResponse
    {
        $this->notificationService->markAsRead($notification);
        return response()->json(['message' => 'Notifikasi telah dibaca.']);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $this->notificationService->markAllAsRead($request->user());
        return response()->json(['message' => 'Semua notifikasi telah dibaca.']);
    }
}
