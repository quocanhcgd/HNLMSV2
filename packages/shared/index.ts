/**
 * @lms/shared — hằng số & type dùng chung giữa web / api / worker.
 * Nguồn chuẩn: docs/10-roles + docs/04-database-schema (users.role).
 */
export const APP_NAME = 'EduCenter LMS';
export const APP_VERSION = '0.1.0';

export enum UserRole {
  Student = 'Student',
  Teacher = 'Teacher',
  Admin = 'Admin',
}

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
}

/** Quy ước D1: mọi dữ liệu gắn organization_id/branch_id (branch-scoped). */
export interface BranchScope {
  organizationId: string;
  branchId: string;
}
