import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * T049/T050 — Learning & Content (DDL docs/04-database-schema.md §7):
 * learning_content + content_versions + content_class_links.
 * (content_progress + library_* thuộc T053/T055 — tạo ở phase sau.)
 * DEVIATION (D9): chưa có anti-virus scanner — thay bằng allowlist MIME + giới hạn
 * 500MB + SHA-256 hash; storage local apps/api/uploads (docs/07-operations: /var/lms/uploads
 * ở prod).
 */
export class CreateLearningContent1787800000008 implements MigrationInterface {
  name = 'CreateLearningContent1787800000008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS learning_content (
        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id  UUID NOT NULL REFERENCES organizations(id),
        branch_id        UUID REFERENCES branches(id),
        owner_id         UUID NOT NULL REFERENCES users(id),
        title            VARCHAR(255) NOT NULL,
        content_type     VARCHAR(30) NOT NULL
                         CHECK (content_type IN ('document','video','audio','presentation','interactive','ebook')),
        access_scope     VARCHAR(20) NOT NULL DEFAULT 'class'
                         CHECK (access_scope IN ('public','class','private')),
        category         VARCHAR(100),
        subject          VARCHAR(100),
        file_ref         VARCHAR(500),
        file_size_bytes  BIGINT,
        file_hash        VARCHAR(64),
        mime_type        VARCHAR(100),
        current_version  INTEGER NOT NULL DEFAULT 1,
        approval_status  VARCHAR(20) NOT NULL DEFAULT 'approved'
                         CHECK (approval_status IN ('draft','pending','approved','rejected')),
        status           VARCHAR(20) NOT NULL DEFAULT 'published'
                         CHECK (status IN ('draft','published','archived')),
        usage_policy     JSONB,
        created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at       TIMESTAMPTZ
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_content_scope ON learning_content (access_scope, status)`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_content_owner ON learning_content (owner_id)`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS content_versions (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        content_id  UUID NOT NULL REFERENCES learning_content(id) ON DELETE CASCADE,
        version     INTEGER NOT NULL,
        file_ref    VARCHAR(500),
        file_hash   VARCHAR(64),
        change_note TEXT,
        created_by  UUID NOT NULL REFERENCES users(id),
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (content_id, version)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS content_class_links (
        content_id UUID NOT NULL REFERENCES learning_content(id) ON DELETE CASCADE,
        class_id   UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        PRIMARY KEY (content_id, class_id)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS content_class_links`);
    await queryRunner.query(`DROP TABLE IF EXISTS content_versions`);
    await queryRunner.query(`DROP TABLE IF EXISTS learning_content`);
  }
}
