/**
 * @lms/license-core — STUB (D9)
 *
 * Giai đoạn này KHÔNG triển khai hệ thống quản lý license (docs/02-spec.md US0,
 * docs/01-architecture.md §5.2). Package này là **integration seam**:
 *   - Trả license mặc định (dev/evaluation): mọi module effective_enabled = true,
 *     không enforce constraint.
 *   - Giữ interface `LicenseService` để giai đoạn sau thay `DefaultLicenseProvider`
 *     bằng LicenseFileVerifier (RSA-2048/SHA-256 chữ ký license file) + tính
 *     constraint (max_students, max_branches, max_storage_gb, addons, expiry).
 *     Không phone-home từng request.
 */

/** Các module nghiệp vụ (khớp apps/api/src/modules/* + docs/01-architecture §3). */
export const DEFAULT_MODULES = [
  'organization',
  'academic',
  'enrollment',
  'learning',
  'finance',
  'reports',
  'integrations',
  'notifications',
  'addons',
] as const;

export type LicenseModuleKey = (typeof DEFAULT_MODULES)[number];

export interface LicenseConstraints {
  /** null = không giới hạn (license mặc định). */
  maxStudents: number | null;
  maxBranches: number | null;
  maxStorageGb: number | null;
}

export interface LicenseModuleState {
  moduleKey: string;
  installed: boolean;
  configuredEnabled: boolean;
  licensedEnabled: boolean;
  dependencySatisfied: boolean;
  effectiveEnabled: boolean;
  reason: string | null;
}

export interface LicenseInfo {
  /** 'default' = stub (D9); 'file' = khi có hệ thống quản lý license. */
  type: 'default' | 'file';
  status: 'active' | 'evaluation';
  edition: string;
  /** Hiển thị ở UI: "Default (dev/evaluation)" (US0). */
  label: string;
  constraints: LicenseConstraints;
  modules: LicenseModuleState[];
  expiresAt: string | null;
}

/** Integration seam — thay thế khi triển khai hệ thống quản lý license (D9). */
export interface LicenseService {
  getLicense(): Promise<LicenseInfo>;
  getModules(): Promise<LicenseModuleState[]>;
  getModuleState(moduleKey: string): Promise<LicenseModuleState>;
}

function defaultModuleState(moduleKey: string): LicenseModuleState {
  return {
    moduleKey,
    installed: true,
    configuredEnabled: true,
    licensedEnabled: true,
    dependencySatisfied: true,
    effectiveEnabled: true,
    reason: 'license mặc định (D9)',
  };
}

/** STUB — trả license mặc định; không enforce constraint (D9). */
export class DefaultLicenseProvider implements LicenseService {
  async getLicense(): Promise<LicenseInfo> {
    return {
      type: 'default',
      status: 'evaluation',
      edition: 'evaluation',
      label: 'Default (dev/evaluation)',
      constraints: { maxStudents: null, maxBranches: null, maxStorageGb: null },
      modules: DEFAULT_MODULES.map(defaultModuleState),
      expiresAt: null,
    };
  }

  async getModules(): Promise<LicenseModuleState[]> {
    return DEFAULT_MODULES.map(defaultModuleState);
  }

  async getModuleState(moduleKey: string): Promise<LicenseModuleState> {
    return defaultModuleState(moduleKey);
  }
}
