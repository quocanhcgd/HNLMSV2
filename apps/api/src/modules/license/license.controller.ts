import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { LicenseInfo, LicenseModuleState } from '@lms/license-core';
import { LicenseService } from './license.service';

/**
 * T013' — Contract /license/* (FUTURE, D9).
 * Các endpoint này đánh dấu FUTURE trong OpenAPI: chỉ phục vụ hiển thị trạng thái
 * license mặc định (US0) — KHÔNG hiện trong UI sản xuất cho tới khi triển khai
 * hệ thống quản lý license.
 */
@ApiTags('license')
@Controller('license')
export class LicenseController {
  constructor(private readonly license: LicenseService) {}

  @Get()
  @ApiOperation({
    summary: 'Trạng thái license — FUTURE (D9), hiện trả license mặc định',
    description:
      'FUTURE (D9): contract chờ hệ thống quản lý license. Giai đoạn này luôn trả "Default (dev/evaluation)" — mọi module enabled, không enforce constraint.',
    deprecated: true,
  })
  getLicense(): Promise<LicenseInfo> {
    return this.license.getLicense();
  }

  @Get('modules')
  @ApiOperation({
    summary: 'Danh sách module + effective state — FUTURE (D9)',
    description:
      'FUTURE (D9): khi có hệ thống license sẽ phản ánh installed && configured_enabled && licensed_enabled && dependency_satisfied.',
    deprecated: true,
  })
  getModules(): Promise<LicenseModuleState[]> {
    return this.license.getModules();
  }

  @Get('modules/:moduleKey')
  @ApiOperation({
    summary: 'Effective state 1 module — FUTURE (D9)',
    deprecated: true,
  })
  getModuleState(@Param('moduleKey') moduleKey: string): Promise<LicenseModuleState> {
    return this.license.getModuleState(moduleKey);
  }
}
