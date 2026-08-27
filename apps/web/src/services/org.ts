import { api } from './api';

/**
 * T030/T031 — Org & Branches API (backend T029).
 * Endpoints: GET/PUT /organization · GET/POST /organization/branches · PUT /organization/branches/:id.
 * Contract: docs/05-api/api-spec.yaml §organization.
 */

export interface Organization {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  academicPeriod: string | null;
  currency: string;
  status: 'active' | 'inactive';
  brandSettings?: Record<string, unknown>;
  contactSettings?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string | null;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Paged<T> {
  data: T[];
  meta: { total: number; page: number; pageSize: number };
}

export async function getOrganization(): Promise<Organization> {
  const { data } = await api.get<Organization>('/organization');
  return data;
}

export async function updateOrganization(payload: {
  name?: string;
  timezone?: string;
  academicPeriod?: string;
}): Promise<Organization> {
  const { data } = await api.put<Organization>('/organization', payload);
  return data;
}

export async function listBranches(page = 1, pageSize = 50): Promise<Paged<Branch>> {
  const { data } = await api.get<Paged<Branch>>('/organization/branches', {
    params: { page, page_size: pageSize },
  });
  return data;
}

export async function createBranch(payload: { code: string; name: string; address?: string }): Promise<Branch> {
  const { data } = await api.post<Branch>('/organization/branches', payload);
  return data;
}

export async function updateBranch(
  branchId: string,
  payload: { name?: string; address?: string; status?: 'active' | 'inactive' },
): Promise<Branch> {
  const { data } = await api.put<Branch>(`/organization/branches/${branchId}`, payload);
  return data;
}
