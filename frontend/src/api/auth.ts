import api from './client';
import type { UserInfo, AuthTokens } from '../types/api';

export async function register(email: string, username: string, password: string, passwordConfirm: string) {
  const response = await api.post('/auth/register/', {
    email, username, password, password_confirm: passwordConfirm,
  });
  return response.data as { user: UserInfo; tokens: AuthTokens };
}

export async function login(email: string, password: string) {
  const response = await api.post('/auth/login/', { email, password });
  return response.data as AuthTokens;
}

export async function getProfile(): Promise<UserInfo> {
  const response = await api.get('/auth/me/');
  return response.data;
}

export async function logout(refreshToken: string): Promise<void> {
  await api.post('/auth/logout/', { refresh: refreshToken });
}
