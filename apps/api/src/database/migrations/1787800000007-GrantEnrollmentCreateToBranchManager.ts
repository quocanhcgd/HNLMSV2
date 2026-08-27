import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Data-fix (T046): branch_manager cần quyền ghi danh tại quầy chi nhánh (front desk) —
 * cấp thêm 'enrollment:create' (seed gốc chỉ có academic_manager/teacher).
 */
export class GrantEnrollmentCreateToBranchManager1787800000007 implements MigrationInterface {
  name = 'GrantEnrollmentCreateToBranchManager1787800000007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id FROM roles r
      JOIN permissions p ON p.resource = 'enrollment' AND p.action = 'create'
      WHERE r.code = 'branch_manager'
      ON CONFLICT DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM role_permissions
      WHERE role_id IN (SELECT id FROM roles WHERE code = 'branch_manager')
        AND permission_id IN (SELECT id FROM permissions WHERE resource = 'enrollment' AND action = 'create')
    `);
  }
}
