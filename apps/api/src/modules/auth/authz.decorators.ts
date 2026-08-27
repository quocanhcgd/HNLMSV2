import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'authz_roles';
export const PERMISSIONS_KEY = 'authz_permissions';

/** Yêu cầu 1 trong các role (đọc từ claim role trong JWT). */
export const RequireRoles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

/** Yêu cầu TẤT CẢ các permission (Admin có '*' = pass mọi yêu cầu). */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
