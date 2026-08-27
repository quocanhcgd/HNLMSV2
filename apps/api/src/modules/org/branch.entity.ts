import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Organization } from './organization.entity';

/** Bảng branches — DDL chuẩn docs/04-database-schema.md §4.1 (migration 1787800000001). */
@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId!: string;

  /** unique trong org */
  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  address!: string | null;

  @Column({ name: 'manager_user_id', type: 'uuid', nullable: true })
  managerUserId!: string | null;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status!: 'active' | 'inactive';

  /** T030/T031 mở rộng — liên hệ & khai báo (migration 1787800000002). */
  @Column({ type: 'varchar', length: 30, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  hotline!: string | null;

  @Column({ name: 'tax_code', type: 'varchar', length: 50, nullable: true })
  taxCode!: string | null;

  @Column({ name: 'representative_name', type: 'varchar', length: 255, nullable: true })
  representativeName!: string | null;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @Column({ name: 'opened_at', type: 'date', nullable: true })
  openedAt!: string | null;

  @Column({ name: 'closed_at', type: 'date', nullable: true })
  closedAt!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization?: Organization;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'manager_user_id' })
  manager?: User;
}
