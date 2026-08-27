import { api } from './api';
import { tokenStore } from './token';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
}

export interface ModuleState {
  moduleKey: string;
  label: string;
  effectiveEnabled: boolean;
  constraints: unknown;
}

export interface MeContext {
  user: AuthUser;
  roles: string[];
  permissions: string[];
  modules: ModuleState[];
}

/** POST /auth/login — backend set refresh cookie HTTP-only; access token lưu memory. */
export async function login(email: string, password: string): Promise<void> {
  const { data } = await api.post<{ accessToken: string }>('/auth/login', { email, password });
  tokenStore.set(data.accessToken);
}

/** POST /auth/logout — xóa refresh cookie; xóa access token khỏi memory. */
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    tokenStore.set(null);
  }
}

/** GET /me/context — 401 sẽ được interceptor tự refresh (cookie) rồi retry. */
export async function fetchMeContext(): Promise<MeContext> {
  const { data } = await api.get<MeContext>('/me/context');
  return data;
}
