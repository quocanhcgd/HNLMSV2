import axios from 'axios';

export interface HealthResponse {
  status: 'ok' | 'degraded';
  uptime: number;
  database: 'up' | 'down';
  redis: 'up' | 'down';
  timestamp: string;
}

/** Axios instance — baseURL /api (Vite proxy → http://localhost:4000). */
export const api = axios.create({
  baseURL: '/api',
  timeout: 8000,
});

export async function getHealth(): Promise<HealthResponse> {
  const { data } = await api.get<HealthResponse>('/health');
  return data;
}
