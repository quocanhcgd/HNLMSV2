import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { Role } from '../users/role.entity';
import { ScopeGrant } from '../users/scope-grant.entity';
import { UserRole } from '../users/user-role.entity';
import { ScopeContextService } from './scope-context.service';

/**
 * T034 — Branch scope (FR-004): enforce "user chỉ thấy branch được cấp".
 *
 * Quy tắc:
 *  - org_admin / system_admin (user_roles) hoặc legacy role 'Admin' → null (toàn quyền).
 *  - Người khác → danh sách branch_id từ scope_grants đang hiệu lực (effective_to NULL hoặc > NOW()).
 *  - Người không có grant nào → [] (không thấy gì).
 *
 * Lưu ý thiết kế (note cho sau): AuthzGuard (T018) vẫn dùng map static ROLE_PERMISSIONS theo
 * claim role legacy — permission thật từ role_permissions (T032) chưa được guard đọc. Khi nâng
 * guard lên DB-permission, các hook assertBranchInScope ở BranchesService sẽ tự có hiệu lực với
 * role branch_manager; hiện tại endpoints branch vẫn Admin-only nên filter ở đó là latent.
 */
@Injectable()
export class ScopesService {
  constructor(
    @InjectRepository(ScopeGrant) private readonly grants: Repository<ScopeGrant>,
    @InjectRepository(UserRole) private readonly userRoles: Repository<UserRole>,
    @InjectRepository(Role) private readonly roles: Repository<Role>,
    private readonly ctx: ScopeContextService,
  ) {}

  /** Branch được phép của user (null = toàn quyền). */
  async resolveBranchIds(sub: string, legacyRole?: string): Promise<string[] | null> {
    const ur = await this.userRoles.find({ where: { userId: sub }, relations: { role: true } });
    const codes = ur.map((x) => x.role?.code).filter((c): c is string => Boolean(c));
    if (codes.includes('org_admin') || codes.includes('system_admin') || legacyRole === 'Admin') {
      return null;
    }
    const rows = (await this.grants
      .createQueryBuilder('sg')
      .select('DISTINCT sg.branch_id', 'branch_id')
      .where('sg.user_id = :sub', { sub })
      .andWhere('(sg.effective_to IS NULL OR sg.effective_to > NOW())')
      .andWhere('sg.branch_id IS NOT NULL')
      .getRawMany()) as { branch_id: string }[];
    return rows.map((r) => r.branch_id);
  }

  /** Branch được cấp (đang hiệu lực) của một user bất kỳ. */
  async userGrantedBranchIds(userId: string): Promise<string[]> {
    const rows = (await this.grants
      .createQueryBuilder('sg')
      .select('DISTINCT sg.branch_id', 'branch_id')
      .where('sg.user_id = :userId', { userId })
      .andWhere('(sg.effective_to IS NULL OR sg.effective_to > NOW())')
      .andWhere('sg.branch_id IS NOT NULL')
      .getRawMany()) as { branch_id: string }[];
    return rows.map((r) => r.branch_id);
  }

  /** 403 nếu caller (không phải admin) không được phép thấy user này. */
  async assertUserInScope(userId: string): Promise<void> {
    const allowed = this.ctx.branchIds();
    if (allowed === null) return; // admin — toàn quyền
    const granted = await this.userGrantedBranchIds(userId);
    if (!granted.some((b) => allowed.includes(b))) {
      throw new ForbiddenException('Người dùng nằm ngoài phạm vi branch được cấp');
    }
  }

  /** 403 nếu caller (không phải admin) không được phép thấy branch này. */
  async assertBranchInScope(branchId: string): Promise<void> {
    const allowed = this.ctx.branchIds();
    if (allowed === null) return;
    if (!allowed.includes(branchId)) {
      throw new ForbiddenException('Chi nhánh nằm ngoài phạm vi được cấp');
    }
  }

  /**
   * Thêm điều kiện lọc vào query builder: chỉ lấy rows của user có scope grant
   * thuộc branch được cấp (chỉ áp khi caller không phải admin).
   */
  applyUserScopeFilter<T extends ObjectLiteral>(qb: SelectQueryBuilder<T>, alias: string): void {
    const allowed = this.ctx.branchIds();
    if (allowed === null) return;
    if (allowed.length === 0) {
      qb.andWhere('1 = 0'); // không có branch nào được cấp → không thấy gì
      return;
    }
    qb.andWhere(
      `EXISTS (SELECT 1 FROM scope_grants sgx WHERE sgx.user_id = ${alias}.id
        AND sgx.branch_id IN (:...scopeBranchIds)
        AND (sgx.effective_to IS NULL OR sgx.effective_to > NOW()))`,
      { scopeBranchIds: allowed },
    );
  }
}
