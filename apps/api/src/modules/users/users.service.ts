import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PasswordService } from './password.service';
import { Role } from './role.entity';
import { ScopeGrant } from './scope-grant.entity';
import { UserRole } from './user-role.entity';
import { User } from './user.entity';
import { RolesService } from './roles.service';

export interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
  phone?: string | null;
}

/** Dữ liệu an toàn để trả ra ngoài (không bao giờ chứa passwordHash). */
export type SafeUser = Omit<User, 'passwordHash' | 'twoFaSecret'>;

/** User + roles + scope grants — shape trả từ /users. */
export interface UserDto extends SafeUser {
  roles: { id: string; code: string; name: string }[];
  scopes: ScopeGrant[];
}

export interface ListUsersParams {
  page: number;
  pageSize: number;
  q?: string;
  roleCode?: string;
  branchId?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserRole) private readonly userRoles: Repository<UserRole>,
    @InjectRepository(ScopeGrant) private readonly scopeGrants: Repository<ScopeGrant>,
    private readonly password: PasswordService,
    private readonly roles: RolesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(input: CreateUserInput): Promise<SafeUser> {
    const existing = await this.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Email đã được sử dụng');
    }
    const hash = await this.password.hash(input.password);
    let user: User;
    try {
      user = await this.users.save(
        this.users.create({
          email: input.email.toLowerCase().trim(),
          passwordHash: hash,
          fullName: input.fullName.trim(),
          role: input.role,
          avatarUrl: input.avatarUrl ?? null,
          phone: input.phone ?? null,
          status: 'Active',
        }),
      );
    } catch (err) {
      // PK/unique conflict race — ví dụ 2 request cùng email
      if ((err as { code?: string }).code === '23505') {
        throw new ConflictException('Email đã được sử dụng');
      }
      throw err;
    }
    return this.toSafeUser(user);
  }

  /**
   * T035 — GET /users: danh sách có phân trang + lọc q/roleCode/branchId,
   * kèm roles (user_roles) + scopes (scope_grants). Branch scope filtering thật = T034.
   */
  async list(params: ListUsersParams): Promise<{ data: UserDto[]; meta: { page: number; pageSize: number; total: number } }> {
    const qb = this.users.createQueryBuilder('u');
    if (params.q) {
      qb.andWhere('(LOWER(u.fullName) LIKE LOWER(:q) OR LOWER(u.email) LIKE LOWER(:q))', { q: `%${params.q.trim()}%` });
    }
    if (params.roleCode) {
      qb.innerJoin(UserRole, 'ur', 'ur.user_id = u.id').innerJoin(Role, 'r', 'r.id = ur.role_id').andWhere('r.code = :roleCode', { roleCode: params.roleCode });
    }
    if (params.branchId) {
      qb.innerJoin(ScopeGrant, 'sg', 'sg.user_id = u.id').andWhere('sg.branch_id = :branchId', { branchId: params.branchId });
    }
    const total = await qb.getCount();
    const users = await qb
      .orderBy('u.createdAt', 'DESC')
      .skip((params.page - 1) * params.pageSize)
      .take(params.pageSize)
      .getMany();
    return { data: await this.decorate(users), meta: { page: params.page, pageSize: params.pageSize, total } };
  }

  /** GET /users/{id} — chi tiết + roles + scopes. */
  async getDetail(id: string): Promise<UserDto> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    const [dto] = await this.decorate([user]);
    return dto;
  }

  /** PUT /users/{id} — cập nhật full_name/phone/status. */
  async update(id: string, input: { fullName?: string; phone?: string; status?: 'active' | 'inactive' | 'suspended' }): Promise<UserDto> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    const statusMap: Record<string, string> = { active: 'Active', inactive: 'Inactive', suspended: 'Suspended' };
    if (input.fullName !== undefined) user.fullName = input.fullName.trim();
    if (input.phone !== undefined) user.phone = input.phone;
    if (input.status !== undefined) user.status = statusMap[input.status];
    await this.users.save(user);
    return this.getDetail(id);
  }

  /** PUT /users/{id}/roles — gán (thay thế) vai trò theo code; ghi granted_by. */
  async assignRoles(id: string, roleCodes: string[], grantedBy: string): Promise<UserDto> {
    await this.getByIdOrThrow(id);
    const roles = await this.roles.findByCodes(roleCodes);
    await this.dataSource.transaction(async (em) => {
      await em.delete(UserRole, { userId: id });
      if (roles.length) {
        await em
          .createQueryBuilder()
          .insert()
          .into(UserRole)
          .values(roles.map((r) => ({ userId: id, roleId: r.id, grantedBy })))
          .execute();
      }
    });
    return this.getDetail(id);
  }

  /** POST /users/{id}/scope-grants — cấp scope; organization = org mặc định. */
  async grantScope(
    id: string,
    input: { branchId?: string; classId?: string; studentId?: string; effectiveFrom?: string; effectiveTo?: string },
    createdBy: string,
  ): Promise<ScopeGrant> {
    await this.getByIdOrThrow(id);
    if (!input.branchId && !input.classId && !input.studentId) {
      throw new BadRequestException('Cần ít nhất branch_id/class_id/student_id');
    }
    const orgRow = (await this.dataSource.query(
      `SELECT id FROM organizations ORDER BY (slug = 'default') DESC, created_at ASC LIMIT 1`,
    )) as { id: string }[];
    if (!orgRow.length) throw new BadRequestException('Chưa có organization');
    const grant = this.scopeGrants.create({
      userId: id,
      organizationId: orgRow[0].id,
      branchId: input.branchId ?? null,
      classId: input.classId ?? null,
      studentId: input.studentId ?? null,
      effectiveFrom: input.effectiveFrom ? new Date(input.effectiveFrom) : new Date(),
      effectiveTo: input.effectiveTo ? new Date(input.effectiveTo) : null,
      createdBy,
    });
    if (grant.effectiveTo && grant.effectiveTo <= grant.effectiveFrom) {
      throw new BadRequestException('effective_to phải sau effective_from');
    }
    return this.scopeGrants.save(grant);
  }

  /** GET /users/{id}/scope-grants — danh sách scope (kể cả hết hạn để audit). */
  listScopes(id: string): Promise<ScopeGrant[]> {
    return this.scopeGrants.find({ where: { userId: id }, order: { createdAt: 'DESC' } });
  }

  /** DELETE /users/{id}/scope-grants/{scopeId}. */
  async removeScope(userId: string, scopeId: string): Promise<void> {
    const grant = await this.scopeGrants.findOne({ where: { id: scopeId, userId } });
    if (!grant) throw new NotFoundException('Không tìm thấy scope grant');
    await this.scopeGrants.delete(scopeId);
  }

  /** roles + permissions thật từ DB cho /me/context (T035). */
  async rbacFor(userId: string): Promise<{ roles: string[]; permissions: string[] }> {
    const rows = (await this.dataSource.query(
      `SELECT r.code, p.resource, p.action
         FROM user_roles ur
         JOIN roles r ON r.id = ur.role_id
         LEFT JOIN role_permissions rp ON rp.role_id = r.id
         LEFT JOIN permissions p ON p.id = rp.permission_id
        WHERE ur.user_id = $1`,
      [userId],
    )) as { code: string; resource: string | null; action: string | null }[];
    const roles = [...new Set(rows.map((r) => r.code))];
    const wildcard = roles.some((c) => c === 'org_admin' || c === 'system_admin');
    const permissions = wildcard
      ? ['*']
      : [...new Set(rows.filter((r) => r.resource).map((r) => `${r.resource}:${r.action}`))];
    return { roles, permissions };
  }

  /** Scope đang hiệu lực cho /me/context. */
  async activeScopes(userId: string): Promise<{ branches: string[]; classes: string[]; students: string[] }> {
    const grants = await this.scopeGrants
      .createQueryBuilder('sg')
      .where('sg.userId = :userId', { userId })
      .andWhere('(sg.effectiveTo IS NULL OR sg.effectiveTo > NOW())')
      .getMany();
    return {
      branches: [...new Set(grants.map((g) => g.branchId).filter(Boolean))] as string[],
      classes: [...new Set(grants.map((g) => g.classId).filter(Boolean))] as string[],
      students: [...new Set(grants.map((g) => g.studentId).filter(Boolean))] as string[],
    };
  }

  private async decorate(users: User[]): Promise<UserDto[]> {
    if (!users.length) return [];
    const ids = users.map((u) => u.id);
    const ur = await this.userRoles.find({ where: ids.map((userId) => ({ userId })), relations: { role: true } });
    const grants = await this.scopeGrants.find({ where: ids.map((userId) => ({ userId })), order: { createdAt: 'DESC' } });
    return users.map((u) => ({
      ...this.toSafeUser(u),
      roles: ur.filter((x) => x.userId === u.id).map((x) => ({ id: x.roleId, code: x.role?.code ?? '', name: x.role?.name ?? '' })),
      scopes: grants.filter((g) => g.userId === u.id),
    }));
  }

  findByEmail(email: string): Promise<User | null> {
    return this.users.findOne({ where: { email: email.toLowerCase().trim() } });
  }

  /** Chỉ dùng khi cần xác thực — lấy cả password_hash. */
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('LOWER(user.email) = LOWER(:email)', { email: email.trim() })
      .getOne();
  }

  findById(id: string): Promise<User | null> {
    return this.users.findOne({ where: { id } });
  }

  /** Trả SafeUser hoặc throw — dùng cho controller. */
  async getByIdOrThrow(id: string): Promise<SafeUser> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return this.toSafeUser(user);
  }

  async validateCredentials(email: string, plainPassword: string): Promise<SafeUser | null> {
    const user = await this.findByEmailWithPassword(email);
    if (!user || user.status === 'Inactive' || user.status === 'Suspended') return null;
    const ok = await this.password.compare(plainPassword, user.passwordHash);
    if (!ok) return null;
    return this.toSafeUser(user);
  }

  async markLastLogin(id: string, ip?: string): Promise<void> {
    await this.users.update(id, {
      lastLoginAt: new Date(),
      lastLoginIp: ip ?? null,
    });
  }

  toSafeUser(user: User): SafeUser {
    const { passwordHash: _ph, twoFaSecret: _ts, ...safe } = user;
    return safe;
  }
}
