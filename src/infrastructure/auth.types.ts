
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'CARER' | 'PROTECTED';
  acceptedTerms: boolean;
}

export interface AuthResponse {
  id: number;
  token: string;
  email: string;
  fullName: string;
  role: 'CARER' | 'PROTECTED' | 'ADMIN';
  image: string;
}

export interface AuthUser {
  id: number;
  token: string;
  email: string;
  fullName: string;
  role: 'CARER' | 'PROTECTED' | 'ADMIN';
  image: string;
}