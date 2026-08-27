import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * T032+T033+T035 — Bảng RBAC (roles, permissions, role_permissions, user_roles, scope_grants)
 * + seed mặc định. DDL chuẩn: docs/04-database-schema.md §4.3 (roles/permissions/user_roles),
 * §4.4 (scope_grants).
 *
 * Ghi chú:
 *  - scope_grants.branch_id/class_id/student_id là cột UUID KHÔNG FK — bảng branches (T028),
 *    classes/students (T038+) chưa tồn tại; FK sẽ thêm khi các bảng đó ra đời.
 *  - Seed: organization mặc định (slug 'default'), 25 permissions, 8 roles, role_permissions,
 *    gán admin@educenter.vn → org_admin (user seed có sẵn từ T016).
 *  - D9: không liên quan license; admission_consultant là role addon CRM (chưa kích hoạt).
 */
export class CreateRbacTables1787800000000 implements MigrationInterface {
  name = 'CreateRbacTables1787800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ---- roles ----
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id UUID NOT NULL REFERENCES organizations(id),
        code            VARCHAR(50) NOT NULL,
        name            VARCHAR(100) NOT NULL,
        description     TEXT,
        is_system       BOOLEAN NOT NULL DEFAULT FALSE,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (organization_id, code)
      )
    `);
    // ---- permissions ----
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        resource    VARCHAR(100) NOT NULL,
        action      VARCHAR(50)  NOT NULL,
        description TEXT,
        UNIQUE (resource, action)
      )
    `);
    // ---- role_permissions ----
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id       UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
        PRIMARY KEY (role_id, permission_id)
      )
    `);
    // ---- user_roles ----
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role_id       UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        granted_by    UUID REFERENCES users(id),
        granted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (user_id, role_id)
      )
    `);
    // ---- scope_grants ----
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS scope_grants (
        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        organization_id UUID NOT NULL REFERENCES organizations(id),
        branch_id       UUID,
        class_id        UUID,
        student_id      UUID,
        effective_from  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        effective_to    TIMESTAMPTZ,
        created_by      UUID REFERENCES users(id),
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CHECK (branch_id IS NOT NULL OR class_id IS NOT NULL OR student_id IS NOT NULL)
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_scope_grants_user ON scope_grants (user_id)
    `);
    // LƯU Ý (note cho thiết kế sau): docs/04-database-schema.md §4.4 đề xuất index partial
    // `WHERE effective_to IS NULL OR effective_to > NOW()` — Postgres TỪ CHỐI (NOW() không IMMUTABLE
    // trong index predicate). Bỏ index partial; idx_scope_grants_user đủ cho MVP (T034 có thể thêm
    // index theo query thật sau).

    // ---- SEED: organization mặc định (nếu chưa có) ----
    await queryRunner.query(`
      INSERT INTO organizations (name, slug, timezone, currency, status)
      SELECT 'EduCenter LMS', 'default', 'Asia/Ho_Chi_Minh', 'VND', 'active'
      WHERE NOT EXISTS (SELECT 1 FROM organizations)
    `);

    // ---- SEED: permissions ----
    const perms = [
      ['org', 'read', 'Xem tổ chức'], ['org', 'update', 'Cập nhật tổ chức'],
      ['branch', 'read', 'Xem chi nhánh'], ['branch', 'create', 'Tạo chi nhánh'], ['branch', 'update', 'Cập nhật chi nhánh'],
      ['user', 'read', 'Xem người dùng'], ['user', 'create', 'Tạo người dùng'], ['user', 'update', 'Cập nhật người dùng'],
      ['user', 'delete', 'Xóa người dùng'], ['role', 'manage', 'Quản lý vai trò & quyền'], ['scope', 'grant', 'Cấp scope truy cập'],
      ['program', 'create', 'Tạo chương trình'], ['program', 'update', 'Cập nhật chương trình'],
      ['class', 'create', 'Tạo lớp'], ['class', 'update', 'Cập nhật lớp'], ['schedule', 'manage', 'Quản lý lịch học'],
      ['enrollment', 'create', 'Ghi danh học viên'],
      ['invoice', 'read', 'Xem hóa đơn'], ['invoice', 'create', 'Tạo hóa đơn'], ['payment', 'record', 'Ghi nhận thanh toán'],
      ['refund', 'create', 'Tạo hoàn tiền'], ['report', 'export', 'Xuất báo cáo'],
      ['license', 'read', 'Xem license'], ['license', 'activate', 'Kích hoạt license'],
      ['auth', 'context', 'Xem context đăng nhập'], ['queue', 'test', 'Dev: enqueue job test'],
    ];
    for (const [resource, action, description] of perms) {
      await queryRunner.query(
        `INSERT INTO permissions (resource, action, description) VALUES ($1, $2, $3)
         ON CONFLICT (resource, action) DO NOTHING`,
        [resource, action, description],
      );
    }

    // ---- SEED: roles (gắn org mặc định) ----
    const roles: [string, string, string, boolean][] = [
      ['org_admin', 'Organization Admin', 'Tất cả quyền trên toàn hệ thống', true],
      ['system_admin', 'System Admin', 'Hạ tầng kỹ thuật', true],
      ['branch_manager', 'Branch Manager', 'Quyền trong chi nhánh được gán', false],
      ['academic_manager', 'Academic Manager', 'Chương trình, lớp, lịch học', false],
      ['teacher', 'Teacher', 'Lớp được phân công', false],
      ['finance_officer', 'Finance Officer', 'Hóa đơn, thanh toán, báo cáo', false],
      ['student', 'Student', 'Lớp của mình, tiến độ', false],
      ['admission_consultant', 'Admission Consultant', 'Addon CRM — chưa kích hoạt', false],
    ];
    for (const [code, name, description, isSystem] of roles) {
      await queryRunner.query(
        `INSERT INTO roles (organization_id, code, name, description, is_system)
         SELECT o.id, $1, $2, $3, $4 FROM organizations o ORDER BY o.created_at LIMIT 1
         ON CONFLICT (organization_id, code) DO NOTHING`,
        [code, name, description, isSystem],
      );
    }

    // ---- SEED: role_permissions ----
    const grantPerms = (code: string, permsList: string[]) => {
      const list = permsList.map((p) => `'${p}'`).join(', ');
      return queryRunner.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         SELECT r.id, p.id FROM roles r
         JOIN permissions p ON CONCAT(p.resource, ':', p.action) IN (${list})
         WHERE r.code = $1
         ON CONFLICT DO NOTHING`,
        [code],
      );
    };
    await grantPerms('org_admin', [
      'org:read', 'org:update', 'branch:read', 'branch:create', 'branch:update',
      'user:read', 'user:create', 'user:update', 'user:delete', 'role:manage', 'scope:grant',
      'program:create', 'program:update', 'class:create', 'class:update', 'schedule:manage', 'enrollment:create',
      'invoice:read', 'invoice:create', 'payment:record', 'refund:create', 'report:export',
      'license:read', 'license:activate', 'auth:context', 'queue:test',
    ]);
    await grantPerms('system_admin', [
      'org:read', 'branch:read', 'user:read', 'role:manage', 'license:read', 'auth:context', 'queue:test',
    ]);
    await grantPerms('branch_manager', [
      'org:read', 'branch:read', 'branch:create', 'branch:update', 'user:read',
      'invoice:read', 'report:export', 'license:read', 'auth:context',
    ]);
    await grantPerms('academic_manager', [
      'program:create', 'program:update', 'class:create', 'class:update', 'schedule:manage', 'enrollment:create',
      'user:read', 'report:export', 'auth:context',
    ]);
    await grantPerms('teacher', ['user:read', 'enrollment:create', 'license:read', 'auth:context']);
    await grantPerms('finance_officer', [
      'invoice:read', 'invoice:create', 'payment:record', 'refund:create', 'report:export',
      'user:read', 'auth:context',
    ]);
    await grantPerms('student', ['auth:context', 'user:read']);
    await grantPerms('admission_consultant', [
      'user:read', 'user:create', 'enrollment:create', 'report:export', 'auth:context',
    ]);

    // ---- SEED: ánh xạ cột role legacy (T016: Student/Teacher/Admin) → user_roles ----
    // Admin → org_admin; Teacher → teacher; Student → student. Role tùy chỉnh thêm sau qua API.
    await queryRunner.query(`
      INSERT INTO user_roles (user_id, role_id, granted_at)
      SELECT u.id, r.id, NOW() FROM users u
      JOIN roles r ON r.code = CASE LOWER(u.role)
        WHEN 'admin' THEN 'org_admin'
        WHEN 'teacher' THEN 'teacher'
        WHEN 'student' THEN 'student'
        ELSE NULL END
      WHERE r.code IS NOT NULL
      ON CONFLICT (user_id, role_id) DO NOTHING
    `);

    // ---- SEED: admin@educenter.vn → org_admin (T016 đã seed user) ----
    await queryRunner.query(`
      INSERT INTO user_roles (user_id, role_id, granted_at)
      SELECT u.id, r.id, NOW() FROM users u
      JOIN roles r ON r.code = 'org_admin'
      WHERE LOWER(u.email) = 'admin@educenter.vn'
      ON CONFLICT (user_id, role_id) DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS scope_grants`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_roles`);
    await queryRunner.query(`DROP TABLE IF EXISTS role_permissions`);
    await queryRunner.query(`DROP TABLE IF EXISTS permissions`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles`);
  }
}
