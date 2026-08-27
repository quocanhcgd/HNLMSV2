import { Injectable } from '@nestjs/common';
import {
  DefaultLicenseProvider,
  type LicenseInfo,
  type LicenseModuleState,
  type LicenseService as LicenseServiceInterface,
} from '@lms/license-core';

/**
 * Wrapper quanh license-core (STUB, D9). Giữ seam để giai đoạn sau swap
 * implementation qua DI mà không đổi controller.
 */
@Injectable()
export class LicenseService implements LicenseServiceInterface {
  constructor(private readonly provider: DefaultLicenseProvider) {}

  getLicense(): Promise<LicenseInfo> {
    return this.provider.getLicense();
  }

  getModules(): Promise<LicenseModuleState[]> {
    return this.provider.getModules();
  }

  getModuleState(moduleKey: string): Promise<LicenseModuleState> {
    return this.provider.getModuleState(moduleKey);
  }
}
