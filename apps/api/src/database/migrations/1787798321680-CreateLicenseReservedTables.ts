import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * T012' — Bảng license RESERVED (D9).
 * Tạo 4 bảng giữ schema cho điểm kết nối chờ (integration seam): khi triển khai
 * hệ thống quản lý license sẽ seed + sử dụng. Không seed dữ liệu license thật.
 * DDL chuẩn: docs/04-database-schema.md §5.
 */
export class CreateLicenseReservedTables1787798321680 implements MigrationInterface {
  name = 'CreateLicenseReservedTables1787798321680';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS licenses (
        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id UUID NOT NULL REFERENCES organizations(id),
        license_key_id  VARCHAR(100) NOT NULL,
        term_type       VARCHAR(20) NOT NULL CHECK (term_type IN ('perpetual','subscription')),
        starts_at       TIMESTAMPTZ NOT NULL,
        expires_at      TIMESTAMPTZ,
        grace_until     TIMESTAMPTZ,
        status          VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','grace','expired','revoked')),
        constraints     JSONB NOT NULL,
        base_modules    JSONB NOT NULL DEFAULT '[]',
        support_until   TIMESTAMPTZ,
        updates_until   TIMESTAMPTZ,
        signature       TEXT NOT NULL,
        issued_at       TIMESTAMPTZ NOT NULL,
        revoked_at      TIMESTAMPTZ,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (organization_id, license_key_id)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS addon_licenses (
        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        license_id      UUID NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
        addon_id        VARCHAR(50) NOT NULL,
        addon_name      VARCHAR(100) NOT NULL,
        serial_key      VARCHAR(100) NOT NULL,
        activated_at    TIMESTAMPTZ,
        expires_at      TIMESTAMPTZ,
        status          VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','grace','expired','revoked')),
        UNIQUE (license_id, addon_id),
        UNIQUE (serial_key)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS module_states (
        organization_id     UUID NOT NULL REFERENCES organizations(id),
        module_key          VARCHAR(50) NOT NULL,
        installed           BOOLEAN NOT NULL DEFAULT FALSE,
        configured_enabled  BOOLEAN NOT NULL DEFAULT FALSE,
        licensed_enabled    BOOLEAN NOT NULL DEFAULT FALSE,
        dependency_satisfied BOOLEAN NOT NULL DEFAULT TRUE,
        effective_enabled   BOOLEAN NOT NULL DEFAULT FALSE,
        reason              VARCHAR(255),
        evaluated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (organization_id, module_key)
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS feature_flags (
        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id UUID NOT NULL REFERENCES organizations(id),
        module_key      VARCHAR(50) NOT NULL,
        flag_key        VARCHAR(100) NOT NULL,
        value           JSONB NOT NULL DEFAULT 'true',
        description     TEXT,
        UNIQUE (organization_id, module_key, flag_key)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS feature_flags`);
    await queryRunner.query(`DROP TABLE IF EXISTS module_states`);
    await queryRunner.query(`DROP TABLE IF EXISTS addon_licenses`);
    await queryRunner.query(`DROP TABLE IF EXISTS licenses`);
  }
}
