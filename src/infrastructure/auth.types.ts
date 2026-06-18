
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthUser {
  token: string;
  email: string;
  fullName: string;
  role: string;
}