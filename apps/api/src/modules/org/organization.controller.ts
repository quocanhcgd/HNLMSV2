import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../auth/authz.decorators';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationService } from './organization.service';

/**
 * T029 — /api/organization + /api/organization/branches (Admin only).
 * Guard: JwtAuthGuard global + @RequirePermissions — Admin ('*') pass; Teacher/Student bị chặn.
 * Contract: docs/05-api/api-spec.yaml /organization, /organization/branches.
 */
@ApiTags('organization')
@ApiBearerAuth()
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly orgs: OrganizationService,
    private readonly branches: BranchesService,
  ) {}

  @Get()
  @RequirePermissions('org:read')
  @ApiOperation({ summary: 'Thông tin tổ chức (org mặc định)' })
  getOrganization() {
    return this.orgs.getDefault();
  }

  @Put()
  @RequirePermissions('org:update')
  @ApiOperation({ summary: 'Cập nhật cấu hình tổ chức' })
  updateOrganization(@Body() dto: UpdateOrganizationDto) {
    return this.orgs.update(dto);
  }

  @Get('branches')
  @RequirePermissions('branch:read')
  @ApiOperation({ summary: 'Danh sách chi nhánh (phân trang)' })
  listBranches(@Query('page') page = '1', @Query('page_size') pageSize = '20') {
    return this.branches.list(Math.max(1, Number(page) || 1), Math.min(100, Math.max(1, Number(pageSize) || 20)));
  }

  @Post('branches')
  @RequirePermissions('branch:create')
  @ApiOperation({ summary: 'Tạo chi nhánh (code unique trong org)' })
  createBranch(@Body() dto: CreateBranchDto) {
    return this.branches.create(dto);
  }

  @Get('branches/:branchId')
  @RequirePermissions('branch:read')
  @ApiOperation({ summary: 'Chi tiết chi nhánh' })
  getBranch(@Param('branchId') branchId: string) {
    return this.branches.getByIdOrThrow(branchId);
  }

  @Put('branches/:branchId')
  @RequirePermissions('branch:update')
  @ApiOperation({ summary: 'Cập nhật chi nhánh (archive = status inactive)' })
  updateBranch(@Param('branchId') branchId: string, @Body() dto: UpdateBranchDto) {
    return this.branches.update(branchId, dto);
  }
}
