import axios from 'axios';
import { tokenStore } from './token';

export interface HealthResponse {
  status: 'ok' | 'degraded';
  uptime: number;
  database: 'up' | 'down';
  redis: 'up' | 'down';
  timestamp: string;
}

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    /** Đánh dấu đã thử refresh 1 lần (tránh loop vô hạn). */
    _retried?: boolean;
  }
}

/** Axios instance — baseURL /api (Vite proxy → http://localhost:4001). */
export const api = axios.create({
  baseURL: '/api',
  timeout: 8000,
});

// Gắn Bearer token (memory) vào mọi request
api.interceptors.request.use((config) => {
  const t = tokenStore.get();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// 401 → thử refresh 1 lần (cookie HTTP-only) rồi retry request gốc; thất bại → anonymous
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;
    const url: string = config?.url ?? '';
    const isAuthEndpoint =
      url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/logout');
    if (error.response?.status === 401 && !isAuthEndpoint && config && !config._retried) {
      config._retried = true;
      try {
        const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
        tokenStore.set(data.accessToken);
        config.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(config);
      } catch {
        tokenStore.set(null);
        tokenStore.notifyAuthFailure();
      }
    }
    return Promise.reject(error);
  },
);

export async function getHealth(): Promise<HealthResponse> {
  const { data } = await api.get<HealthResponse>('/health');
  return data;
}
