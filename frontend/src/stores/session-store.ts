import { create } from 'zustand';

interface SessionState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  clearSession: () => set({ token: null }),
}));
