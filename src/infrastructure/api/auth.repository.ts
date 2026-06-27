import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../auth.types';

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080';


export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authRepository = {

async login(
  credentials: LoginRequest
): Promise<AuthResponse> {

  const response =
    await apiClient.post<AuthResponse>(
      '/api/v1/auth/login',
      credentials
    );

  return response.data;
},


async googleLogin(
  credential: string
): Promise<AuthResponse> {

  const response =
    await apiClient.post<AuthResponse>(
      '/api/v1/auth/google',
      {
        credential
      }
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
    const response = await apiClient.get(`/api/v1/auth/verify?token=${token}`);
    return response.data;
  },

};

// Actualiza la foto del usuario en la base de datos
export async function uploadUserImage(image: File, email: string): Promise<string> {
  const token = localStorage.getItem('vera_token') || sessionStorage.getItem('vera_token');

  const formData = new FormData();
            formData.append("image", image);
            formData.append("email", email);

  const response = await axios.put(
    "http://localhost:8080/api/v1/files/upload-user-image",
    formData,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
  );

  return response.data.image;
}