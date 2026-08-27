import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';

export interface UpdateOrganizationInput {
  name?: string;
  timezone?: string;
  academicPeriod?: string;
  brandSettings?: Record<string, unknown>;
  contactSettings?: Record<string, unknown>;
}

/**
 * T027 — Organization entity + service.
 * MVP single-tenant: org mặc định (slug 'default' hoặc đầu tiên chưa xóa).
 * Org tạo qua migration seed; API chỉ GET/PUT cấu hình.
 */
@Injectable()
export class OrganizationService {
  constructor(@InjectRepository(Organization) private readonly orgs: Repository<Organization>) {}

  /** Org hiện tại (slug 'default' ưu tiên, fallback org đầu tiên). */
  async getDefault(): Promise<Organization> {
    const org = await this.orgs
      .createQueryBuilder('o')
      .where('o.deletedAt IS NULL')
      .orderBy("(o.slug = 'default')", 'DESC')
      .addOrderBy('o.createdAt', 'ASC')
      .getOne();
    if (!org) throw new NotFoundException('Chưa có organization — chạy migration seed trước');
    return org;
  }

  /** PUT /organization — cập nhật cấu hình org mặc định. */
  async update(input: UpdateOrganizationInput): Promise<Organization> {
    const org = await this.getDefault();
    if (input.name !== undefined) org.name = input.name.trim();
    if (input.timezone !== undefined) org.timezone = input.timezone;
    if (input.academicPeriod !== undefined) org.academicPeriod = input.academicPeriod ?? null;
    if (input.brandSettings !== undefined) org.brandSettings = input.brandSettings;
    if (input.contactSettings !== undefined) org.contactSettings = input.contactSettings;
    return this.orgs.save(org);
  }
}
