import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * T044/T045 — Students & Enrollment (DDL docs/04-database-schema.md §6):
 * students (hồ sơ học viên — 3-layer: users=account, students=registry), enrollments,
 * enrollment_progress + trigger sync_class_enrolled_count (cập nhật classes.enrolled_count
 * khi thêm/đổi status enrollment).
 * DEVIATION (ghi D9): invoices chưa có bảng (phase Finance) — POST /enrollments không tạo
 * invoice, trả invoice:null. financial_account_ref để trống.
 */
export class CreateStudentsEnrollments1787800000006 implements MigrationInterface {
  name = 'CreateStudentsEnrollments1787800000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS students (
        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id UUID NOT NULL REFERENCES organizations(id),
        user_id         UUID REFERENCES users(id),
        student_code    VARCHAR(50) NOT NULL,
        full_name       VARCHAR(255) NOT NULL,
        date_of_birth   DATE,
        gender          VARCHAR(20),
        phone           VARCHAR(30),
        guardian_phone  VARCHAR(30),
        identity_ref    VARCHAR(100),
        status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','inactive','graduated','dropped')),
        notes           TEXT,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at      TIMESTAMPTZ,
        UNIQUE (organization_id, student_code)
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_students_user ON students (user_id)`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_students_search ON students USING gin (to_tsvector('simple', full_name || ' ' || COALESCE(student_code,'')))`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id   UUID NOT NULL REFERENCES organizations(id),
        branch_id         UUID NOT NULL REFERENCES branches(id),
        student_id        UUID NOT NULL REFERENCES students(id),
        class_id          UUID NOT NULL REFERENCES classes(id),
        status            VARCHAR(30) NOT NULL DEFAULT 'pending_payment'
                          CHECK (status IN ('pending_payment','active','completed','dropped','suspended','waitlist')),
        enrolled_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        completion_state  VARCHAR(30),
        financial_account_ref UUID,
        created_by        UUID REFERENCES users(id),
        created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (student_id, class_id)
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_enrollments_class ON enrollments (class_id, status)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments (student_id)`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS enrollment_progress (
        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        enrollment_id    UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
        progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
        completed_sessions INTEGER NOT NULL DEFAULT 0,
        total_sessions   INTEGER NOT NULL DEFAULT 0,
        last_activity_at TIMESTAMPTZ,
        updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (enrollment_id)
      )
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION sync_class_enrolled_count() RETURNS TRIGGER AS $$
      BEGIN
          IF TG_OP = 'INSERT' AND NEW.status IN ('pending_payment','active') THEN
              UPDATE classes SET enrolled_count = enrolled_count + 1 WHERE id = NEW.class_id;
          ELSIF TG_OP = 'UPDATE' AND OLD.status IN ('pending_payment','active')
                AND NEW.status NOT IN ('pending_payment','active') THEN
              UPDATE classes SET enrolled_count = enrolled_count - 1 WHERE id = NEW.class_id;
          END IF;
          RETURN NEW;
      END; $$ LANGUAGE plpgsql
    `);
    await queryRunner.query(`
      CREATE TRIGGER trg_enrollment_count AFTER INSERT OR UPDATE OF status ON enrollments
        FOR EACH ROW EXECUTE FUNCTION sync_class_enrolled_count()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_enrollment_count ON enrollments`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS sync_class_enrolled_count()`);
    await queryRunner.query(`DROP TABLE IF EXISTS enrollment_progress`);
    await queryRunner.query(`DROP TABLE IF EXISTS enrollments`);
    await queryRunner.query(`DROP TABLE IF EXISTS students`);
  }
}
