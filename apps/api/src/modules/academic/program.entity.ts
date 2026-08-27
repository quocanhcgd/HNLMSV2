import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Department } from './department.entity';

/** Bảng programs — DDL docs/04-database-schema.md §6 (migration 1787800000004). */
@Entity('programs')
export class Program {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId!: string;

  @Column({ name: 'department_id', type: 'uuid' })
  departmentId!: string;

  @ManyToOne(() => Department, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'department_id' })
  department?: Department;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  objectives!: Record<string, unknown> | null;

  @Column({ name: 'duration_months', type: 'int', nullable: true })
  durationMonths!: number | null;

  @Column({ name: 'completion_rules', type: 'jsonb', nullable: true })
  completionRules!: Record<string, unknown> | null;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status!: 'draft' | 'active' | 'archived';

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
