import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Data-fix (T050/T051): permissions học liệu — content:read (xem + tải) và
 * content:manage (upload/quản lý). Gán: teacher + academic_manager = manage+read,
 * branch_manager + student = read. Admin/system_admin có '*' (T018) nên tự qua.
 */
export class SeedLearningPermissions1787800000009 implements MigrationInterface {
  name = 'SeedLearningPermissions1787800000009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const [resource, action] of [
      ['content', 'read'],
      ['content', 'manage'],
    ] as const) {
      await queryRunner.query(
        `INSERT INTO permissions (resource, action, description)
         VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [resource, action, `Học liệu: ${action === 'read' ? 'xem & tải' : 'upload & quản lý'}`],
      );
    }
    const grant = (role: string, action: string) =>
      queryRunner.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         SELECT r.id, p.id FROM roles r
         JOIN permissions p ON p.resource = 'content' AND p.action = $2
         WHERE r.code = $1
         ON CONFLICT DO NOTHING`,
        [role, action],
      );
    for (const role of ['teacher', 'academic_manager']) {
      await grant(role, 'read');
      await grant(role, 'manage');
    }
    for (const role of ['branch_manager', 'student']) {
      await grant(role, 'read');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM role_permissions WHERE permission_id IN (SELECT id FROM permissions WHERE resource = 'content')`,
    );
    await queryRunner.query(`DELETE FROM permissions WHERE resource = 'content'`);
  }
}
