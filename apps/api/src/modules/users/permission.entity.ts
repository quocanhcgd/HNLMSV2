import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Bảng permissions — DDL chuẩn docs/04-database-schema.md §4.3.
 * Tên permission = `resource:action` (vd user:create, report:export).
 */
@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** invoice, class, user... */
  @Column({ type: 'varchar', length: 100 })
  resource!: string;

  /** create, read, update, delete, export... */
  @Column({ type: 'varchar', length: 50 })
  action!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;
}
