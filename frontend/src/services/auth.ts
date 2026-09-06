import { apiClient, ApiError } from '../api/client';
import { AuthTokens, AuthUser, LoginCredentials } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ tokens: AuthTokens; user: AuthUser }> {
    const { data: tokens } = await apiClient.post<AuthTokens>('/auth/login', credentials);
    const { data: user } = await apiClient.get<AuthUser>('/auth/me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    return { tokens, user };
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const { data } = await apiClient.post<AuthTokens>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return data;
  },

  async getCurrentUser(): Promise<AuthUser> {
    const { data } = await apiClient.get<AuthUser>('/auth/me');
    return data;
  },

  async logout(): Promise<void> {
    // The backend does not expose a dedicated logout endpoint; the client-side session is cleared locally.
    return;
  },
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Authentication failed';
}
