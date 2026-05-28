import api from './api';
import type { Notification, PaginatedResponse } from '../types';

const notificationService = {
  getAll: (params?: { page?: number }) =>
    api.get<PaginatedResponse<Notification> & { unread_count: number }>('/notifications', { params }),
  markAsRead: (id: number) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
};

export default notificationService;
