import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * T030/T031 mở rộng — Thêm cột liên hệ & khai báo cho branches.
 * Field set đã duyệt: phone, email, hotline, tax_code, representative_name, note.
 * opened_at/closed_at đã có từ migration 1787800000001.
 */
export class AddBranchContactColumns1787800000002 implements MigrationInterface {
  name = 'AddBranchContactColumns1787800000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE branches ADD COLUMN phone VARCHAR(30)`);
    await queryRunner.query(`ALTER TABLE branches ADD COLUMN email VARCHAR(255)`);
    await queryRunner.query(`ALTER TABLE branches ADD COLUMN hotline VARCHAR(30)`);
    await queryRunner.query(`ALTER TABLE branches ADD COLUMN tax_code VARCHAR(50)`);
    await queryRunner.query(`ALTER TABLE branches ADD COLUMN representative_name VARCHAR(255)`);
    await queryRunner.query(`ALTER TABLE branches ADD COLUMN note TEXT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE branches DROP COLUMN IF EXISTS note`);
    await queryRunner.query(`ALTER TABLE branches DROP COLUMN IF EXISTS representative_name`);
    await queryRunner.query(`ALTER TABLE branches DROP COLUMN IF EXISTS tax_code`);
    await queryRunner.query(`ALTER TABLE branches DROP COLUMN IF EXISTS hotline`);
    await queryRunner.query(`ALTER TABLE branches DROP COLUMN IF EXISTS email`);
    await queryRunner.query(`ALTER TABLE branches DROP COLUMN IF EXISTS phone`);
  }
}
