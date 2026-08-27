import { Module } from '@nestjs/common';
import { DefaultLicenseProvider } from '@lms/license-core';
import { LicenseController } from './license.controller';
import { LicenseService } from './license.service';

/**
 * T011' + T013' — License module STUB (D9).
 * Trả license mặc định (dev/evaluation); contract /license/* đánh dấu FUTURE trong OpenAPI.
 * Điểm kết nối chờ: khi có hệ thống quản lý license, thay DefaultLicenseProvider
 * bằng implementation verify RSA-2048/SHA-256 (docs/01-architecture.md §5.2).
 */
@Module({
  controllers: [LicenseController],
  providers: [LicenseService, DefaultLicenseProvider],
  exports: [LicenseService],
})
export class LicenseModule {}
