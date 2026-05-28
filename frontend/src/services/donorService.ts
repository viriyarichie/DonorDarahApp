import api from './api';
import type { Donor, PaginatedResponse } from '../types';

const donorService = {
  getAll: (params?: { page?: number }) =>
    api.get<PaginatedResponse<Donor>>('/donors', { params }),
  getById: (id: number) => api.get<{ data: Donor }>(`/donors/${id}`),
  getStats: () => api.get('/donors/stats'),
  getLatestCondition: () => api.get('/kondisi/terbaru'),
};

export default donorService;
