import { create } from 'zustand';
import type { UserInfo } from '../types/api';
import * as authApi from '../api/auth';

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,

  login: async (email, password) => {
    const tokens = await authApi.login(email, password);
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    const user = await authApi.getProfile();
    set({ user, isAuthenticated: true });
  },

  register: async (email, username, password, passwordConfirm) => {
    const data = await authApi.register(email, username, password, passwordConfirm);
    localStorage.setItem('access_token', data.tokens.access);
    localStorage.setItem('refresh_token', data.tokens.refresh);
    set({ user: data.user, isAuthenticated: true });
  },

  logout: () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) authApi.logout(refresh).catch(() => {});
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false });
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const user = await authApi.getProfile();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
