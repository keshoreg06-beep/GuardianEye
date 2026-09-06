import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, getErrorMessage } from '../services/auth';
import { useSessionStore } from '../stores/session-store';
import type { LoginCredentials } from '../types/auth';

export function useAuth() {
  const navigate = useNavigate();
  const { user, accessToken, refreshToken, isAuthenticated, setSession, clearSession, updateAccessToken } = useSessionStore();

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const { tokens, user } = await authService.login(credentials);
      setSession({ user, tokens });
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error) };
    }
  }, [setSession]);

  const logout = useCallback(() => {
    clearSession();
    navigate('/login', { replace: true });
  }, [clearSession, navigate]);

  const refreshSession = useCallback(async () => {
    if (!refreshToken) {
      clearSession();
      return { ok: false, reason: 'missing-refresh-token' as const };
    }

    try {
      const nextTokens = await authService.refresh(refreshToken);
      updateAccessToken(nextTokens.access_token, nextTokens.expires_in);
      return { ok: true };
    } catch {
      clearSession();
      navigate('/login', { replace: true });
      return { ok: false, reason: 'expired-session' as const };
    }
  }, [clearSession, navigate, refreshToken, updateAccessToken]);

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    login,
    logout,
    refreshSession,
  };
}
