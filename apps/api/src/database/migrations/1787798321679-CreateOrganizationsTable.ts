import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Bảng organizations — nền cho mọi entity branch-scoped (quy ước D1)
 * và FK của bảng license RESERVED (T012'). DDL chuẩn: docs/04-database-schema.md §4.1.
 */
export class CreateOrganizationsTable1787798321679 implements MigrationInterface {
  name = 'CreateOrganizationsTable1787798321679';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name             VARCHAR(255) NOT NULL,
        slug             VARCHAR(100) UNIQUE NOT NULL,
        timezone         VARCHAR(64) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
        academic_period  VARCHAR(50),
        currency         VARCHAR(3) NOT NULL DEFAULT 'VND',
        brand_settings   JSONB NOT NULL DEFAULT '{}',
        contact_settings JSONB NOT NULL DEFAULT '{}',
        status           VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
        created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at       TIMESTAMPTZ
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS organizations`);
  }
}
