import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable HTTP-only cookies
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Helper to get cookie value
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

// Request interceptor for CSRF token
api.interceptors.request.use((config) => {
  const token = getCookie('XSRF-TOKEN');
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 419 CSRF token mismatch
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Refresh CSRF token
        await axios.get(`${API_URL}/sanctum/csrf-cookie`, { withCredentials: true });
        // Retry original request
        return api(originalRequest);
      } catch (csrfError) {
        return Promise.reject(csrfError);
      }
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Clear auth state - handled by AuthContext
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('unauthorized'));
      }
    }

    return Promise.reject(error);
  }
);

export default api;
