/**
 * Danh mục permission (RBAC — FR-005, SEC-006).
 * Role → permission map: Admin có '*' (toàn quyền); Teacher/Student theo bảng.
 * Role tùy chỉnh + scope_grants (branch/class): giai đoạn sau (module users/roles).
 */
export const PERMISSIONS = [
  'auth:context', // xem /me/context
  'license:read', // xem trạng thái module/quota
  'queue:test', // dev: enqueue job test
  'user:read', // (dự phòng module users)
  'user:write', // (dự phòng module users)
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<string, readonly string[]> = {
  Admin: ['*'],
  Teacher: ['auth:context', 'license:read', 'user:read'],
  Student: ['auth:context', 'license:read', 'user:read'],
};
