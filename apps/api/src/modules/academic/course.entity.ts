import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Program } from './program.entity';

/** Bảng courses — DDL docs/04-database-schema.md §6 (migration 1787800000004). */
@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId!: string;

  @Column({ name: 'program_id', type: 'uuid' })
  programId!: string;

  @ManyToOne(() => Program, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'program_id' })
  program?: Program;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex!: number;

  @Column({ type: 'uuid', array: true, nullable: true })
  prerequisites!: string[] | null;

  @Column({ name: 'learning_outcomes', type: 'jsonb', nullable: true })
  learningOutcomes!: Record<string, unknown> | null;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status!: 'draft' | 'active' | 'archived';

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
