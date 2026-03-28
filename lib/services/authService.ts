import api from '../api/axios';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

class AuthService {
  async getCsrfToken() {
    await api.get('/sanctum/csrf-cookie');
  }

  async login(email: string, password: string) {
    await this.getCsrfToken();
    return await api.post('/api/auth/login', { email, password });
  }

  async register(data: RegisterData) {
    await this.getCsrfToken();
    return await api.post('/api/auth/register', data);
  }

  async logout() {
    return await api.post('/api/auth/logout');
  }

  async getUser() {
    return await api.get('/api/auth/user');
  }

  async forgotPassword(email: string) {
    await this.getCsrfToken();
    return await api.post('/api/auth/forgot-password', { email });
  }

  async resetPassword(data: any) {
    await this.getCsrfToken();
    return await api.post('/api/auth/reset-password', data);
  }
}

export default new AuthService();
