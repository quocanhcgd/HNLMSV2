import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ScopeContextService } from '../scopes/scope-context.service';
import { ScopesService } from '../scopes/scopes.service';
import { Branch } from './branch.entity';
import { OrganizationService } from './organization.service';

export interface CreateBranchInput {
  code: string;
  name: string;
  address?: string;
  managerUserId?: string;
  phone?: string;
  email?: string;
  hotline?: string;
  taxCode?: string;
  representativeName?: string;
  openedAt?: string;
  note?: string;
}

export interface UpdateBranchInput {
  name?: string;
  address?: string;
  managerUserId?: string;
  status?: 'active' | 'inactive';
  phone?: string;
  email?: string;
  hotline?: string;
  taxCode?: string;
  representativeName?: string;
  openedAt?: string;
  closedAt?: string;
  note?: string;
}

/**
 * T028 — Branch entity + service.
 * code unique trong org (DB UNIQUE(organization_id, code) enforce).
 * Không xóa cứng: archive = status 'inactive' (api-spec không có DELETE).
 */
@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch) private readonly branches: Repository<Branch>,
    private readonly orgs: OrganizationService,
    private readonly scopes: ScopesService,
    private readonly scopeCtx: ScopeContextService,
  ) {}

  /**
   * GET /organization/branches — phân trang, không gồm deleted.
   * T034: caller không phải admin chỉ thấy branch được cấp (latent — guard branch:read
   * hiện vẫn Admin-only, filter kích hoạt khi AuthzGuard đọc permission từ DB, xem note ScopesService).
   */
  async list(page = 1, pageSize = 20): Promise<{ data: Branch[]; meta: { page: number; pageSize: number; total: number } }> {
    const allowed = this.scopeCtx.branchIds();
    const [data, total] = await this.branches.findAndCount({
      where: allowed === null ? {} : { id: In(allowed) },
      relations: { manager: true }, // T030+T031: cột quản lý (passwordHash/2FA secret tự loại khỏi select)
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { data, meta: { page, pageSize, total } };
  }

  async getByIdOrThrow(id: string): Promise<Branch> {
    await this.scopes.assertBranchInScope(id); // T034 (latent — xem note)
    const branch = await this.branches.findOne({ where: { id }, relations: { manager: true } });
    if (!branch) throw new NotFoundException('Không tìm thấy chi nhánh');
    return branch;
  }

  async create(input: CreateBranchInput): Promise<Branch> {
    const org = await this.orgs.getDefault();
    if (input.managerUserId) await this.assertManagerExists(input.managerUserId);
    const branch = this.branches.create({
      organizationId: org.id,
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      address: input.address ?? null,
      managerUserId: input.managerUserId ?? null,
      phone: input.phone ?? null,
      email: input.email ?? null,
      hotline: input.hotline ?? null,
      taxCode: input.taxCode ?? null,
      representativeName: input.representativeName ?? null,
      openedAt: input.openedAt ?? new Date().toISOString().slice(0, 10), // mặc định = hôm nay
      note: input.note ?? null,
      status: 'active',
    });
    try {
      return await this.branches.save(branch);
    } catch (err) {
      if ((err as { code?: string }).code === '23505') {
        throw new ConflictException(`Mã chi nhánh '${branch.code}' đã tồn tại`);
      }
      throw err;
    }
  }

  async update(id: string, input: UpdateBranchInput): Promise<Branch> {
    const branch = await this.getByIdOrThrow(id);
    if (input.name !== undefined) branch.name = input.name.trim();
    if (input.address !== undefined) branch.address = input.address ?? null;
    if (input.managerUserId !== undefined) {
      if (input.managerUserId) await this.assertManagerExists(input.managerUserId);
      branch.managerUserId = input.managerUserId ?? null;
    }
    if (input.phone !== undefined) branch.phone = input.phone ?? null;
    if (input.email !== undefined) branch.email = input.email ?? null;
    if (input.hotline !== undefined) branch.hotline = input.hotline ?? null;
    if (input.taxCode !== undefined) branch.taxCode = input.taxCode ?? null;
    if (input.representativeName !== undefined) branch.representativeName = input.representativeName ?? null;
    if (input.openedAt !== undefined) branch.openedAt = input.openedAt ?? null;
    if (input.note !== undefined) branch.note = input.note ?? null;
    if (input.status !== undefined) {
      branch.status = input.status;
      // archive → ghi closed_at (nếu chưa có); mở lại → xóa closed_at
      if (input.status === 'inactive' && !branch.closedAt) {
        branch.closedAt = new Date().toISOString().slice(0, 10);
      }
      if (input.status === 'active') branch.closedAt = null;
    }
    if (input.closedAt !== undefined) branch.closedAt = input.closedAt ?? null;
    return this.branches.save(branch);
  }

  private async assertManagerExists(userId: string): Promise<void> {
    const found = await this.branches
      .createQueryBuilder('b')
      .select('1')
      .where('EXISTS (SELECT 1 FROM users u WHERE u.id = :userId AND u.deleted_at IS NULL)', { userId })
      .getRawOne();
    if (!found) throw new BadRequestException('manager_user_id không tồn tại trong users');
  }
}
