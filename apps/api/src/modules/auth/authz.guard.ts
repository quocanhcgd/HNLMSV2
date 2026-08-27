import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, ROLES_KEY } from './authz.decorators';
import type { AuthedRequest } from './jwt-auth.guard';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ROLE_PERMISSIONS } from './permissions';

/**
 * AuthzGuard (global, T018) — phân quyền dựa trên claim role trong JWT:
 *   @RequireRoles('Admin')              → role phải nằm trong danh sách
 *   @RequirePermissions('license:read') → role phải có đủ permission (Admin '*' pass)
 * Chạy SAU JwtAuthGuard (đã attach req.user). Endpoint @Public() được bỏ qua.
 */
@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredPerms = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length && !requiredPerms?.length) return true;

    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const role = req.user?.role;
    if (!role) throw new ForbiddenException('Chưa xác thực');

    if (requiredRoles?.length && !requiredRoles.includes(role)) {
      throw new ForbiddenException(`Yêu cầu vai trò: ${requiredRoles.join(' / ')}`);
    }

    if (requiredPerms?.length) {
      const granted = ROLE_PERMISSIONS[role] ?? [];
      const all = granted.includes('*');
      const missing = requiredPerms.filter((p) => !granted.includes(p));
      if (!all && missing.length) {
        throw new ForbiddenException(`Thiếu quyền: ${missing.join(', ')}`);
      }
    }
    return true;
  }
}
