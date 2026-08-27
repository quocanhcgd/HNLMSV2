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

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status!: 'active' | 'inactive';

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
