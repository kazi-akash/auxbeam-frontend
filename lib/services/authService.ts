/**
 * @deprecated Use the hooks in lib/hooks/public/useAuth.ts instead.
 * This service is kept for backward compatibility with AuthContext.
 */
import api from '../api/axios';
import type { User, RegisterPayload, UpdateProfilePayload } from '../types';

export type { User, UpdateProfilePayload };

/** @deprecated Use RegisterPayload from lib/types instead */
export type RegisterData = RegisterPayload;

class AuthService {
  async login(email: string, password: string) {
    return await api.post('/api/auth/login', { email, password });
  }

  async register(data: RegisterPayload) {
    return await api.post('/api/auth/register', data);
  }

  async logout() {
    return await api.post('/api/auth/logout');
  }

  async getUser() {
    return await api.get('/api/auth/user');
  }

  async forgotPassword(email: string) {
    return await api.post('/api/auth/forgot-password', { email });
  }

  async resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return await api.post('/api/auth/reset-password', data);
  }

  async updateProfile(data: UpdateProfilePayload) {
    return await api.put('/api/auth/profile', data);
  }

  async changePassword(data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) {
    return await api.put('/api/auth/password', data);
  }
}

export default new AuthService();
