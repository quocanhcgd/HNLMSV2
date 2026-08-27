import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../auth/authz.decorators';
import { CreateRoleDto } from './dto/create-role.dto';
import { SetRolePermissionsDto } from './dto/set-role-permissions.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

/**
 * T035 — /api/roles: danh sách (kèm permissions), CRUD, gán permissions.
 * Vai trò hệ thống (is_system) không xóa được.
 */
@ApiTags('users')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly roles: RolesService) {}

  @Get()
  @RequirePermissions('user:read')
  @ApiOperation({ summary: 'Danh sách vai trò (kèm permissions)' })
  list() {
    return this.roles.list();
  }

  @Get('permissions')
  @RequirePermissions('user:read')
  @ApiOperation({ summary: 'Danh mục permission có sẵn' })
  permissions() {
    return this.roles.listPermissions();
  }

  @Post()
  @RequirePermissions('role:manage')
  @ApiOperation({ summary: 'Tạo vai trò' })
  create(@Body() dto: CreateRoleDto) {
    return this.roles.create(dto);
  }

  @Patch(':roleId')
  @RequirePermissions('role:manage')
  @ApiOperation({ summary: 'Sửa tên/mô tả vai trò' })
  update(@Param('roleId') roleId: string, @Body() dto: UpdateRoleDto) {
    return this.roles.update(roleId, dto);
  }

  @Delete(':roleId')
  @RequirePermissions('role:manage')
  @ApiOperation({ summary: 'Xóa vai trò (không xóa is_system)' })
  remove(@Param('roleId') roleId: string) {
    return this.roles.remove(roleId);
  }

  @Put(':roleId/permissions')
  @RequirePermissions('role:manage')
  @ApiOperation({ summary: 'Gán (thay thế) permissions theo key resource:action' })
  setPermissions(@Param('roleId') roleId: string, @Body() dto: SetRolePermissionsDto) {
    return this.roles.setPermissions(roleId, dto.permissionKeys);
  }
}
