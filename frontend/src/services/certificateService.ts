import api from './api';
import type { Certificate, PaginatedResponse } from '../types';

const certificateService = {
  getAll: (params?: { page?: number }) =>
    api.get<PaginatedResponse<Certificate>>('/certificates', { params }),
  request: (milestone: number) =>
    api.post<{ data: Certificate; message: string }>('/certificates/request', { milestone }),
  approve: (id: number) => api.post(`/certificates/${id}/approve`),
  reject: (id: number) => api.post(`/certificates/${id}/reject`),
  downloadUrl: (id: number) => `/api/certificates/${id}/download`,
};

export default certificateService;
