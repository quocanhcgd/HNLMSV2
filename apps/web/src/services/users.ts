import { api } from './api';

/**
 * T035 wiring — Users & Roles API.
 * Users: GET/POST /users, GET/PUT /users/:id, PUT /users/:id/roles,
 *        POST/GET /users/:id/scope-grants, DELETE /users/:id/scope-grants/:scopeId.
 * Roles: GET /roles (kèm permissions), GET /roles/permissions, PUT /roles/:id/permissions.
 */

export interface RoleLite {
  id: string;
  code: string;
  name: string;
}

export interface ScopeGrantLite {
  id: string;
  branchId: string | null;
  classId: string | null;
  studentId: string | null;
  effectiveFrom: string;
  effectiveTo: string | null;
  createdAt: string;
}

export interface UserRow {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  status: string; // Active | Inactive | Suspended
  lastLoginAt: string | null;
  createdAt: string;
  roles: RoleLite[];
  scopes: ScopeGrantLite[];
}

export interface PagedUsers {
  data: UserRow[];
  meta: { page: number; pageSize: number; total: number };
}

export interface PermissionLite {
  id: string;
  resource: string;
  action: string;
  description?: string | null;
}

export interface RoleFull {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: PermissionLite[];
}

export interface ListUsersParams {
  page: number;
  pageSize: number;
  q?: string;
  role?: string;
  branchId?: string;
  status?: string;
}

export async function listUsers(params: ListUsersParams): Promise<PagedUsers> {
  const { data } = await api.get<PagedUsers>('/users', {
    params: {
      page: params.page,
      page_size: params.pageSize, // backend đọc page_size (kebab) — không spread để tránh key sai
      q: params.q || undefined,
      role: params.role || undefined,
      branch_id: params.branchId || undefined,
      status: params.status || undefined,
    },
  });
  return data;
}

export async function createUser(payload: { email: string; password: string; fullName: string; phone?: string; roleCodes?: string[] }): Promise<UserRow> {
  const { data } = await api.post<UserRow>('/users', payload);
  return data;
}

export async function getUser(id: string): Promise<UserRow> {
  const { data } = await api.get<UserRow>(`/users/${id}`);
  return data;
}

export async function updateUser(
  id: string,
  payload: { fullName?: string; phone?: string; status?: 'active' | 'inactive' | 'suspended' },
): Promise<UserRow> {
  const { data } = await api.put<UserRow>(`/users/${id}`, payload);
  return data;
}

export async function assignRoles(id: string, roleCodes: string[]): Promise<UserRow> {
  const { data } = await api.put<UserRow>(`/users/${id}/roles`, { roleCodes });
  return data;
}

export async function grantScope(
  id: string,
  payload: { branchId?: string; classId?: string; studentId?: string; effectiveFrom?: string; effectiveTo?: string },
): Promise<ScopeGrantLite> {
  const { data } = await api.post<ScopeGrantLite>(`/users/${id}/scope-grants`, payload);
  return data;
}

export async function listScopes(id: string): Promise<ScopeGrantLite[]> {
  const { data } = await api.get<ScopeGrantLite[]>(`/users/${id}/scope-grants`);
  return data;
}

export async function removeScope(userId: string, scopeId: string): Promise<void> {
  await api.delete(`/users/${userId}/scope-grants/${scopeId}`);
}

export async function listRoles(): Promise<RoleFull[]> {
  const { data } = await api.get<RoleFull[]>('/roles');
  return data;
}

export async function listPermissions(): Promise<PermissionLite[]> {
  const { data } = await api.get<PermissionLite[]>('/roles/permissions');
  return data;
}

export async function setRolePermissions(roleId: string, permissionKeys: string[]): Promise<RoleFull> {
  const { data } = await api.put<RoleFull>(`/roles/${roleId}/permissions`, { permissionKeys });
  return data;
}
