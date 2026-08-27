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
  status: 'active' | 'inactive' | 'suspended';
  brandSettings: OrgBrandSettings;
  contactSettings: OrgContactSettings;
  createdAt: string;
  updatedAt: string;
}

/** Key cấu trúc của contact_settings JSONB (docs/04-database-schema.md §4.1). */
export interface OrgContactSettings {
  shortName?: string;
  address?: string;
  phone?: string;
  hotline?: string;
  email?: string;
  website?: string;
  fax?: string;
  taxCode?: string;
  licenseNo?: string;
  representative?: string;
  foundedAt?: string;
  bankName?: string;
  bankAccount?: string;
  bankHolder?: string;
}

/** Key cấu trúc của brand_settings JSONB. */
export interface OrgBrandSettings {
  logoUrl?: string;
  slogan?: string;
  brandColor?: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  hotline: string | null;
  taxCode: string | null;
  representativeName: string | null;
  note: string | null;
  status: 'active' | 'inactive';
  managerUserId: string | null;
  manager: { id: string; fullName: string; email: string } | null;
  openedAt: string | null;
  closedAt: string | null;
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
  contactSettings?: OrgContactSettings;
  brandSettings?: OrgBrandSettings;
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

export async function createBranch(payload: {
  code: string;
  name: string;
  address?: string | null;
  managerUserId?: string | null;
  phone?: string | null;
  email?: string | null;
  hotline?: string | null;
  taxCode?: string | null;
  representativeName?: string | null;
  openedAt?: string | null;
  note?: string | null;
}): Promise<Branch> {
  const { data } = await api.post<Branch>('/organization/branches', payload);
  return data;
}

export async function updateBranch(
  branchId: string,
  payload: {
    name?: string;
    address?: string | null;
    managerUserId?: string | null;
    status?: 'active' | 'inactive';
    phone?: string | null;
    email?: string | null;
    hotline?: string | null;
    taxCode?: string | null;
    representativeName?: string | null;
    openedAt?: string | null;
    closedAt?: string | null;
    note?: string | null;
  },
): Promise<Branch> {
  const { data } = await api.put<Branch>(`/organization/branches/${branchId}`, payload);
  return data;
}
