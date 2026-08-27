import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * DATA FIX (B — nâng AuthzGuard đọc DB permissions):
 * role_permissions của role 'student' trong DB dev bị ghi đè thành 25 quyền (gần bằng org_admin)
 * do thao tác toggle/save ở tab Roles (thử nghiệm E2E T036) — lệch với seed chuẩn (chỉ
 * ['auth:context', 'user:read']). Khi guard đọc DB, student sẽ có toàn quyền — phải sửa ngay.
 * Đồng thời khôi phục name/description chuẩn của mọi role (self-healing, idempotent).
 */
export class FixSeedRoleData1787800000003 implements MigrationInterface {
  name = 'FixSeedRoleData1787800000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) student role_permissions → đúng seed chuẩn (2 quyền)
    await queryRunner.query(`DELETE FROM role_permissions WHERE role_id IN (SELECT id FROM roles WHERE code = 'student')`);
    await queryRunner.query(
      `INSERT INTO role_permissions (role_id, permission_id)
       SELECT r.id, p.id FROM roles r
       JOIN permissions p ON CONCAT(p.resource, ':', p.action) IN ('auth:context', 'user:read')
       WHERE r.code = 'student'
       ON CONFLICT DO NOTHING`,
    );

    // 2) khôi phục name/description chuẩn của 8 role (idempotent)
    await queryRunner.query(
      `UPDATE roles r SET name = v.name, description = v.description FROM (VALUES
         ('org_admin', 'Organization Admin', 'Tất cả quyền trên toàn hệ thống'),
         ('system_admin', 'System Admin', 'Hạ tầng kỹ thuật'),
         ('branch_manager', 'Branch Manager', 'Quyền trong chi nhánh được gán'),
         ('academic_manager', 'Academic Manager', 'Chương trình, lớp, lịch học'),
         ('teacher', 'Teacher', 'Lớp được phân công'),
         ('finance_officer', 'Finance Officer', 'Hóa đơn, thanh toán, báo cáo'),
         ('student', 'Student', 'Lớp của mình, tiến độ'),
         ('admission_consultant', 'Admission Consultant', 'Addon CRM — chưa kích hoạt')
       ) AS v(code, name, description)
       WHERE r.code = v.code`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // data fix — không revert (down không cần làm gì)
  }
}
