import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../auth/authz.decorators';
import type { AuthedRequest } from '../auth/jwt-auth.guard';
import { CreateScopeGrantDto } from './dto/create-scope-grant.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

/**
 * T035 — /api/users: danh sách (scope T034 sau), tạo, cập nhật, gán vai trò, cấp scope.
 * Guard: JwtAuthGuard global + @RequirePermissions (Admin '*' pass — T018).
 */
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @RequirePermissions('user:read')
  @ApiOperation({ summary: 'Danh sách người dùng (phân trang + lọc q/role/branch_id/status)' })
  list(
    @Query('page') page = '1',
    @Query('page_size') pageSize = '20',
    @Query('q') q?: string,
    @Query('role') roleCode?: string,
    @Query('branch_id') branchId?: string,
    @Query('status') status?: string,
  ) {
    const p = Math.max(1, Number(page) || 1);
    const ps = Math.min(100, Math.max(1, Number(pageSize) || 20));
    return this.users.list({ page: p, pageSize: ps, q, roleCode, branchId, status });
  }

  @Post()
  @RequirePermissions('user:create')
  @ApiOperation({ summary: 'Tạo người dùng + gán vai trò (roleCodes)' })
  async create(@Body() dto: CreateUserDto, @Req() req: AuthedRequest) {
    // role column legacy có CHECK ('Student','Teacher','Admin') — suy từ roleCodes,
    // RBAC thật nằm ở user_roles; mặc định Student.
    const legacyRole = dto.roleCodes?.includes('org_admin') || dto.roleCodes?.includes('system_admin')
      ? 'Admin'
      : dto.roleCodes?.includes('teacher')
        ? 'Teacher'
        : 'Student';
    const user = await this.users.create({
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
      role: legacyRole,
      phone: dto.phone ?? null,
    });
    if (dto.roleCodes?.length) {
      return this.users.assignRoles(user.id, dto.roleCodes, req.user.sub);
    }
    return this.users.getDetail(user.id);
  }

  @Get(':userId')
  @RequirePermissions('user:read')
  @ApiOperation({ summary: 'Chi tiết người dùng (kèm roles + scopes)' })
  get(@Param('userId') userId: string) {
    return this.users.getDetail(userId);
  }

  @Put(':userId')
  @RequirePermissions('user:update')
  @ApiOperation({ summary: 'Cập nhật full_name/phone/status' })
  update(@Param('userId') userId: string, @Body() dto: UpdateUserDto) {
    return this.users.update(userId, dto);
  }

  @Put(':userId/roles')
  @RequirePermissions('role:manage')
  @ApiOperation({ summary: 'Gán (thay thế) vai trò theo code' })
  assignRoles(@Param('userId') userId: string, @Body() dto: AssignRolesDto, @Req() req: AuthedRequest) {
    return this.users.assignRoles(userId, dto.roleCodes, req.user.sub);
  }

  @Post(':userId/scope-grants')
  @RequirePermissions('scope:grant')
  @ApiOperation({ summary: 'Cấp phạm vi truy cập (branch/class/student)' })
  grantScope(@Param('userId') userId: string, @Body() dto: CreateScopeGrantDto, @Req() req: AuthedRequest) {
    return this.users.grantScope(userId, dto, req.user.sub);
  }

  @Get(':userId/scope-grants')
  @RequirePermissions('scope:grant')
  @ApiOperation({ summary: 'Danh sách scope grant của user' })
  listScopes(@Param('userId') userId: string) {
    return this.users.listScopes(userId);
  }

  @Delete(':userId/scope-grants/:scopeId')
  @RequirePermissions('scope:grant')
  @ApiOperation({ summary: 'Thu hồi scope grant' })
  removeScope(@Param('userId') userId: string, @Param('scopeId') scopeId: string) {
    return this.users.removeScope(userId, scopeId);
  }
}
