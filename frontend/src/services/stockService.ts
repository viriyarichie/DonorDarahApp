import api from './api';
import type { Stock, PaginatedResponse, StockSummary } from '../types';

const stockService = {
  getAll: (params?: { location_id?: number; blood_type?: string }) =>
    api.get<{ data: Stock[]; summary: StockSummary }>('/stocks', { params }),
  create: (data: { blood_type: string; amount: number; location_id: number }) =>
    api.post<{ data: Stock; message: string }>('/stocks', data),
  update: (id: number, data: { blood_type: string; amount: number; location_id: number }) =>
    api.put<{ data: Stock; message: string }>(`/stocks/${id}`, data),
  delete: (id: number) => api.delete(`/stocks/${id}`),
};

export default stockService;
