import api from './api';
import type { Booking, PaginatedResponse } from '../types';

const bookingService = {
  getAll: (params?: { status?: string; page?: number }) =>
    api.get<PaginatedResponse<Booking>>('/bookings', { params }),
  getById: (id: number) => api.get<{ data: Booking }>(`/bookings/${id}`),
  create: (data: { location_id: number; booking_date: string; notes?: string }) =>
    api.post<{ data: Booking; message: string }>('/bookings', data),
  confirm: (id: number) => api.post(`/bookings/${id}/confirm`),
  complete: (id: number) => api.post(`/bookings/${id}/complete`),
  cancel: (id: number) => api.post(`/bookings/${id}/cancel`),
};

export default bookingService;
