export type AuthStatus =
  | 'idle'
  | 'checking'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  roles?: string[];
}

export interface LoginRequestPayload {
  email: string;
  password: string;
}

export interface RegisterRequestPayload extends LoginRequestPayload {
  name?: string | null;
}

export interface RefreshRequestPayload {
  refreshToken?: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
  lastCheckedAt: string | null;
}
