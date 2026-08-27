import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * T028 — Bảng branches + FK scope_grants.branch_id → branches (giải "nợ" T033:
 * migration T035 tạo scope_grants chưa FK vì branches chưa tồn tại).
 * DDL chuẩn: docs/04-database-schema.md §4.1.
 */
export class CreateBranchesTable1787800000001 implements MigrationInterface {
  name = 'CreateBranchesTable1787800000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS branches (
        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        organization_id UUID NOT NULL REFERENCES organizations(id),
        code            VARCHAR(50)  NOT NULL,
        name            VARCHAR(255) NOT NULL,
        address         TEXT,
        manager_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','inactive')),
        opened_at       DATE,
        closed_at       DATE,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at      TIMESTAMPTZ,
        UNIQUE (organization_id, code)
      )
    `);
    // FK bổ sung cho scope_grants (T033) — scope_grants phải rỗng hoặc toàn branch_id hợp lệ
    await queryRunner.query(`
      ALTER TABLE scope_grants
        ADD CONSTRAINT fk_scope_grants_branch
        FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE scope_grants DROP CONSTRAINT IF EXISTS fk_scope_grants_branch`);
    await queryRunner.query(`DROP TABLE IF EXISTS branches`);
  }
}
