import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * T038 — Academic Core (MVP) tables theo DDL docs/04-database-schema.md §6:
 * departments, programs, courses, rooms, classes, class_teachers, schedules.
 *
 * Chống trùng lịch (T039): DDL đề xuất exclusion constraint thô (day_of_week + valid range)
 * → false-positive khi 2 buổi KHÁC GIỜ cùng ngày. Implement CHÍNH XÁC ở tầng service
 * (so trùng teacher/room + weekday + date-range + time-range overlap, trả 409).
 * Bỏ qua exclusion constraint DB (ghi chú D9).
 *
 * Seed permissions mới: program:read, class:read (đọc cấu trúc học thuật) + gán cho
 * branch_manager/academic_manager (+class:read cho teacher). org_admin/system_admin đã
 * qua '*' (rbacFor). student chưa có (learning portal P5).
 */
export class CreateAcademicTables1787800000004 implements MigrationInterface {
  name = 'CreateAcademicTables1787800000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id UUID NOT NULL REFERENCES organizations(id),
        code            VARCHAR(50) NOT NULL,
        name            VARCHAR(255) NOT NULL,
        status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','inactive')),
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (organization_id, code)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS programs (
        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id  UUID NOT NULL REFERENCES organizations(id),
        department_id    UUID NOT NULL REFERENCES departments(id),
        code             VARCHAR(50) NOT NULL,
        name             VARCHAR(255) NOT NULL,
        description      TEXT,
        objectives       JSONB,
        duration_months  INTEGER,
        completion_rules JSONB,
        status           VARCHAR(20) NOT NULL DEFAULT 'draft'
                         CHECK (status IN ('draft','active','archived')),
        created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (organization_id, code)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id  UUID NOT NULL REFERENCES organizations(id),
        program_id       UUID NOT NULL REFERENCES programs(id),
        code             VARCHAR(50) NOT NULL,
        name             VARCHAR(255) NOT NULL,
        description      TEXT,
        order_index      INTEGER NOT NULL DEFAULT 0,
        prerequisites    UUID[],
        learning_outcomes JSONB,
        status           VARCHAR(20) NOT NULL DEFAULT 'draft'
                         CHECK (status IN ('draft','active','archived')),
        created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (program_id, code)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id UUID NOT NULL REFERENCES organizations(id),
        branch_id       UUID NOT NULL REFERENCES branches(id),
        code            VARCHAR(50) NOT NULL,
        name            VARCHAR(100),
        capacity        INTEGER,
        status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','inactive')),
        UNIQUE (branch_id, code)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS classes (
        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id  UUID NOT NULL REFERENCES organizations(id),
        branch_id        UUID NOT NULL REFERENCES branches(id),
        program_id       UUID NOT NULL REFERENCES programs(id),
        course_id        UUID NOT NULL REFERENCES courses(id),
        code             VARCHAR(50) NOT NULL,
        name             VARCHAR(255) NOT NULL,
        modality         VARCHAR(20) NOT NULL DEFAULT 'offline'
                         CHECK (modality IN ('offline','online','hybrid','flexible')),
        capacity         INTEGER NOT NULL DEFAULT 20,
        enrolled_count   INTEGER NOT NULL DEFAULT 0,
        enrollment_status VARCHAR(20) NOT NULL DEFAULT 'draft'
                         CHECK (enrollment_status IN ('draft','open','closed','full','archived')),
        start_date       DATE,
        end_date         DATE,
        status           VARCHAR(20) NOT NULL DEFAULT 'draft'
                         CHECK (status IN ('draft','active','archived')),
        created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (branch_id, code),
        CHECK (enrolled_count <= capacity)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS class_teachers (
        class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        teacher_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role        VARCHAR(50) NOT NULL DEFAULT 'primary'
                    CHECK (role IN ('primary','assistant','substitute')),
        PRIMARY KEY (class_id, teacher_id)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id UUID NOT NULL REFERENCES organizations(id),
        class_id        UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        branch_id       UUID NOT NULL REFERENCES branches(id),
        room_id         UUID REFERENCES rooms(id),
        teacher_id      UUID NOT NULL REFERENCES users(id),
        day_of_week     SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
        start_time      TIME NOT NULL,
        end_time        TIME NOT NULL,
        recurrence      VARCHAR(20) NOT NULL DEFAULT 'weekly'
                        CHECK (recurrence IN ('weekly','biweekly','once')),
        valid_from      DATE NOT NULL,
        valid_to        DATE,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CHECK (end_time > start_time)
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_schedules_class ON schedules (class_id)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_schedules_teacher ON schedules (teacher_id, valid_from)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_schedules_room ON schedules (room_id, valid_from)`);

    // ---- Seed: permission mới program:read / class:read + gán role ----
    await queryRunner.query(`
      INSERT INTO permissions (resource, action, description) VALUES
        ('program', 'read', 'Xem ngành/chương trình/khóa học'),
        ('class', 'read', 'Xem lớp học & lịch học')
      ON CONFLICT (resource, action) DO NOTHING
    `);
    const grantNew = (code: string, permsList: string[]) =>
      queryRunner.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         SELECT r.id, p.id FROM roles r
         JOIN permissions p ON CONCAT(p.resource, ':', p.action) IN (${permsList.map((p) => `'${p}'`).join(', ')})
         WHERE r.code = $1
         ON CONFLICT DO NOTHING`,
        [code],
      );
    await grantNew('branch_manager', ['program:read', 'class:read']);
    await grantNew('academic_manager', ['program:read', 'class:read']);
    await grantNew('teacher', ['class:read']);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS schedules`);
    await queryRunner.query(`DROP TABLE IF EXISTS class_teachers`);
    await queryRunner.query(`DROP TABLE IF EXISTS classes`);
    await queryRunner.query(`DROP TABLE IF EXISTS rooms`);
    await queryRunner.query(`DROP TABLE IF EXISTS courses`);
    await queryRunner.query(`DROP TABLE IF EXISTS programs`);
    await queryRunner.query(`DROP TABLE IF EXISTS departments`);
  }
}
