import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Data fix (T040): bảng `courses` trong DB dev vẫn là schema LEGACY (EduCenter cũ —
 * title/slug/teacher_id/…, 3 dòng seed demo) do `database/lms-schema.sql` cũ chạy trước
 * migration TypeORM; migration 0004 dùng IF NOT EXISTS nên bỏ qua → entity insert lỗi 42703.
 * Legacy còn kéo theo các bảng KHÔNG được app hiện tại dùng (không entity):
 * course_enrollments, lessons, assignments, student_grades, certificates, discussion_threads,
 * course_analytics_view — DROP CASCADE dọn sạch. FK classes.course_id (tạo bởi 0004) bị
 * cascade → tái tạo trỏ tới courses chuẩn mới.
 */
export class ReplaceLegacyCourses1787800000005 implements MigrationInterface {
  name = 'ReplaceLegacyCourses1787800000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS courses CASCADE`);
    await queryRunner.query(`
      CREATE TABLE courses (
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
      ALTER TABLE classes ADD CONSTRAINT classes_course_id_fkey
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // không revert — bảng cũ legacy không có giá trị
  }
}
