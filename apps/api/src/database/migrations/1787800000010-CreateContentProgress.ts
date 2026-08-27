import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * T053/T054 — content_progress (DDL docs/04-database-schema.md §7): tiến độ xem học liệu
 * theo từng học viên (bảng chưa tạo ở 0008 — để dành cho portal học viên).
 */
export class CreateContentProgress1787800000010 implements MigrationInterface {
  name = 'CreateContentProgress1787800000010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS content_progress (
        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        content_id       UUID NOT NULL REFERENCES learning_content(id) ON DELETE CASCADE,
        student_id       UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
        watch_seconds    INTEGER NOT NULL DEFAULT 0,
        is_completed     BOOLEAN NOT NULL DEFAULT FALSE,
        first_viewed_at  TIMESTAMPTZ,
        last_viewed_at   TIMESTAMPTZ,
        UNIQUE (content_id, student_id)
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_content_progress_student ON content_progress (student_id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS content_progress`);
  }
}
