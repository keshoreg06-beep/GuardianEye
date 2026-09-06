import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, AuthTokens } from '../types/auth';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setSession: (payload: { user: AuthUser; tokens: AuthTokens }) => void;
  clearSession: () => void;
  updateAccessToken: (token: string, expiresIn: number) => void;
  hydrate: () => void;
}

const storageKey = 'guardianeye-auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,
      isHydrated: false,
      setSession: ({ user, tokens }) => {
        const expiresAt = Date.now() + tokens.expires_in * 1000;
        set({
          user,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt,
          isAuthenticated: true,
        });
      },
      clearSession: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
        });
      },
      updateAccessToken: (token: string, expiresIn: number) => {
        set({ accessToken: token, expiresAt: Date.now() + expiresIn * 1000, isAuthenticated: true });
      },
      hydrate: () => {
        const state = get();
        set({ isHydrated: true, isAuthenticated: Boolean(state.accessToken && state.user) });
      },
    }),
    {
      name: storageKey,
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export function isSessionExpired(expiresAt: number | null): boolean {
  if (!expiresAt) {
    return true;
  }

  return Date.now() >= expiresAt;
}
