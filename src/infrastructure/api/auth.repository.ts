import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../auth.types';

// Lee la URL del .env.development — si no existe, usa localhost
const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080';

// Instancia de axios configurada para toda la app.
// Equivalente a crear un cliente fetch con baseURL en Node.
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: agrega el JWT a cada request automáticamente
// si el usuario está autenticado. Equivalente al middleware
// que ponías en Express para verificar el token.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vera_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authRepository = {

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/api/v1/auth/login',
      credentials
    );
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/api/v1/auth/register',
      data
    );
    return response.data;
  },

async forgotPassword(email: string): Promise<void> {
  await apiClient.post(
    '/api/v1/auth/forgot-password',
    { email }
  );
},

async resetPassword(
  token: string,
  newPassword: string
): Promise<void> {
  await apiClient.post(
    '/api/v1/auth/reset-password',
    {
      token,
      newPassword
    }
  );
},

verifyEmail: async (token: string) => {
    const response = await apiClient.get(`/auth/verify?token=${token}`);
    return response.data;
  },

};