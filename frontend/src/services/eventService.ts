import api from './api';
import type { Event, PaginatedResponse } from '../types';

const eventService = {
  getAll: (params?: { upcoming?: boolean; page?: number }) =>
    api.get<PaginatedResponse<Event>>('/events', { params }),
  getById: (id: number) => api.get<{ data: Event }>(`/events/${id}`),
  create: (data: Partial<Event> & { location_id: number }) =>
    api.post<{ data: Event; message: string }>('/events', data),
  update: (id: number, data: Partial<Event>) =>
    api.put<{ data: Event; message: string }>(`/events/${id}`, data),
  delete: (id: number) => api.delete(`/events/${id}`),
  register: (id: number) => api.post(`/events/${id}/register`),
  getParticipants: (id: number) => api.get(`/events/${id}/participants`),
  getMyRegistrations: () => api.get('/my-event-registrations'),
};

export default eventService;
