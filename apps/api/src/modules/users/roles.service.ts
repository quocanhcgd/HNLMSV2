import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { Role } from './role.entity';
import { RolePermission } from './role-permission.entity';

/** Vai trò + quyền đi kèm — trả ra controller. */
export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

/**
 * T035 — Vai trò & quyền: CRUD roles + gán role_permissions.
 * Ràng buộc: role is_system không được xóa; code unique trong org (DB enforce).
 */
@Injectable()
export class RolesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Role) private readonly roles: Repository<Role>,
    @InjectRepository(Permission) private readonly permissions: Repository<Permission>,
    @InjectRepository(RolePermission) private readonly rolePermissions: Repository<RolePermission>,
  ) {}

  /** Danh sách role (kèm permissions) — sắp theo created_at. */
  async list(): Promise<RoleWithPermissions[]> {
    const roles = await this.roles.find({ order: { createdAt: 'ASC' } });
    const rps = await this.rolePermissions.find({
      relations: { permission: true },
      where: { roleId: In(roles.map((r) => r.id)) },
    });
    return roles.map((r) => ({
      ...r,
      permissions: rps.filter((rp) => rp.roleId === r.id).map((rp) => rp.permission as Permission),
    }));
  }

  /** Tất cả permission có sẵn (danh mục) — cho UI chọn. */
  listPermissions(): Promise<Permission[]> {
    return this.permissions.find({ order: { resource: 'ASC', action: 'ASC' } });
  }

  async findByCodeOrThrow(code: string): Promise<Role> {
    const role = await this.roles.findOne({ where: { code } });
    if (!role) throw new NotFoundException(`Vai trò '${code}' không tồn tại`);
    return role;
  }

  async findByCodes(codes: string[]): Promise<Role[]> {
    const roles = await this.roles.find({ where: { code: In(codes) } });
    if (roles.length !== new Set(codes).size) {
      const found = new Set(roles.map((r) => r.code));
      const missing = [...new Set(codes)].filter((c) => !found.has(c));
      throw new BadRequestException(`Vai trò không tồn tại: ${missing.join(', ')}`);
    }
    return roles;
  }

  async create(input: { code: string; name: string; description?: string; isSystem?: boolean }): Promise<Role> {
    const org = await this.defaultOrgId();
    const existing = await this.roles.findOne({ where: { code: input.code } });
    if (existing) throw new ConflictException(`Vai trò '${input.code}' đã tồn tại`);
    try {
      return await this.roles.save(
        this.roles.create({
          organizationId: org,
          code: input.code.toLowerCase().trim(),
          name: input.name.trim(),
          description: input.description ?? null,
          isSystem: input.isSystem ?? false,
        }),
      );
    } catch (err) {
      if ((err as { code?: string }).code === '23505') {
        throw new ConflictException(`Vai trò '${input.code}' đã tồn tại`);
      }
      throw err;
    }
  }

  async update(id: string, input: { name?: string; description?: string }): Promise<Role> {
    const role = await this.getByIdOrThrow(id);
    if (input.name) role.name = input.name.trim();
    if (input.description !== undefined) role.description = input.description;
    return this.roles.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.getByIdOrThrow(id);
    if (role.isSystem) {
      throw new BadRequestException('Không thể xóa vai trò hệ thống');
    }
    await this.roles.delete(id);
  }

  /** Gán (thay thế) permissions cho role theo key `resource:action`. */
  async setPermissions(id: string, permissionKeys: string[]): Promise<RoleWithPermissions> {
    await this.getByIdOrThrow(id); // validate role tồn tại
    // permissionKeys là `resource:action` — tra theo cặp (resource, action)
    const found: Permission[] = [];
    for (const key of permissionKeys) {
      const [resource, action] = key.split(':');
      const p = await this.permissions.findOne({ where: { resource, action } });
      if (!p) throw new BadRequestException(`Permission '${key}' không tồn tại`);
      found.push(p);
    }
    await this.dataSource.transaction(async (em) => {
      await em.delete(RolePermission, { roleId: id });
      if (found.length) {
        await em
          .createQueryBuilder()
          .insert()
          .into(RolePermission)
          .values(found.map((p) => ({ roleId: id, permissionId: p.id })))
          .orIgnore()
          .execute();
      }
    });
    const roleWith = await this.list();
    return roleWith.find((r) => r.id === id) as RoleWithPermissions;
  }

  private async getByIdOrThrow(id: string): Promise<Role> {
    const role = await this.roles.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò');
    return role;
  }

  /** Org mặc định (slug 'default' hoặc org đầu tiên). */
  private async defaultOrgId(): Promise<string> {
    const row = (await this.dataSource.query(
      `SELECT id FROM organizations ORDER BY (slug = 'default') DESC, created_at ASC LIMIT 1`,
    )) as { id: string }[];
    if (!row.length) throw new BadRequestException('Chưa có organization — seed migration trước');
    return row[0].id;
  }
}
