import api from './api';
import type { Location } from '../types';

const locationService = {
  getAll: () => api.get<{ data: Location[] }>('/locations'),
  getById: (id: number) => api.get<{ data: Location }>(`/locations/${id}`),
};

export default locationService;
