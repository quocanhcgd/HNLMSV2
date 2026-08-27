import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './branch.entity';
import { OrganizationService } from './organization.service';

export interface CreateBranchInput {
  code: string;
  name: string;
  address?: string;
  managerUserId?: string;
}

export interface UpdateBranchInput {
  name?: string;
  address?: string;
  managerUserId?: string;
  status?: 'active' | 'inactive';
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
  ) {}

  /** GET /organization/branches — phân trang, không gồm deleted. */
  async list(page = 1, pageSize = 20): Promise<{ data: Branch[]; meta: { page: number; pageSize: number; total: number } }> {
    const [data, total] = await this.branches.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { data, meta: { page, pageSize, total } };
  }

  async getByIdOrThrow(id: string): Promise<Branch> {
    const branch = await this.branches.findOne({ where: { id } });
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
    if (input.status !== undefined) branch.status = input.status;
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
