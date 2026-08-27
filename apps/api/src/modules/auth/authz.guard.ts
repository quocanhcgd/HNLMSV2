import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, ROLES_KEY } from './authz.decorators';
import type { AuthedRequest } from './jwt-auth.guard';
import { IS_PUBLIC_KEY } from './public.decorator';
import { UsersService } from '../users/users.service';

/**
 * AuthzGuard (global) — phân quyền dựa trên RBAC THẬT từ DB (B — nâng cấp từ map static T018):
 *   @RequireRoles('Admin')              → role legacy claim HOẶC role DB (user_roles) nằm trong danh sách
 *   @RequirePermissions('license:read') → permission hiệu lực phải chứa đủ (org_admin/system_admin '*' pass)
 *
 * Permission hiệu lực = users.effectiveRbac(sub, legacyRole): DB role_permissions (qua user_roles)
 * HỢP với map static legacy — dùng chung với /me/context nên UI và guard luôn khớp.
 * Chạy SAU JwtAuthGuard (đã attach req.user). Endpoint @Public() được bỏ qua.
 */
@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly users: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
    const legacyRole = req.user?.role;
    if (!legacyRole) throw new ForbiddenException('Chưa xác thực');

    const { roles, permissions } = await this.users.effectiveRbac(req.user.sub, legacyRole);

    if (requiredRoles?.length && !requiredRoles.some((r) => legacyRole === r || roles.includes(r))) {
      throw new ForbiddenException(`Yêu cầu vai trò: ${requiredRoles.join(' / ')}`);
    }

    if (requiredPerms?.length) {
      const all = permissions.includes('*');
      const missing = requiredPerms.filter((p) => !permissions.includes(p));
      if (!all && missing.length) {
        throw new ForbiddenException(`Thiếu quyền: ${missing.join(', ')}`);
      }
    }
    return true;
  }
}
