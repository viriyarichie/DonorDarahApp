import api from './api';
import type { Article, PaginatedResponse } from '../types';

const articleService = {
  getAll: (params?: { search?: string; page?: number }) =>
    api.get<PaginatedResponse<Article>>('/articles', { params }),
  getById: (id: number) => api.get<{ data: Article }>(`/articles/${id}`),
  create: (data: { title: string; content: string; publish?: boolean }) =>
    api.post<{ data: Article; message: string }>('/articles', data),
  update: (id: number, data: { title?: string; content?: string; publish?: boolean }) =>
    api.put<{ data: Article; message: string }>(`/articles/${id}`, data),
  delete: (id: number) => api.delete(`/articles/${id}`),
};

export default articleService;
