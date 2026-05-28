import api from './api';
import type { User } from '../types';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nik: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  birth_date?: string;
  blood_type?: string;
}

export interface AuthResponse {
  data: {
    user: User;
    token: string;
  };
  message: string;
}

const authService = {
  login: (data: LoginData) => api.post<AuthResponse>('/login', data),
  register: (data: RegisterData) => api.post<AuthResponse>('/register', data),
  logout: () => api.post('/logout'),
  me: () => api.get<{ data: User }>('/me'),
  updateProfile: (data: Partial<User & { password: string; password_confirmation: string }>) =>
    api.put('/profile', data),
};

export default authService;
