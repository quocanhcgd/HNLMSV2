import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/** Bảng organizations — DDL chuẩn docs/04-database-schema.md §4.1 (migration 1787798321679). */
@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 64, default: 'Asia/Ho_Chi_Minh' })
  timezone!: string;

  @Column({ name: 'academic_period', type: 'varchar', length: 50, nullable: true })
  academicPeriod!: string | null;

  @Column({ type: 'varchar', length: 3, default: 'VND' })
  currency!: string;

  @Column({ name: 'brand_settings', type: 'jsonb', default: () => "'{}'" })
  brandSettings!: Record<string, unknown>;

  @Column({ name: 'contact_settings', type: 'jsonb', default: () => "'{}'" })
  contactSettings!: Record<string, unknown>;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;
}
