import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Program } from './program.entity';
import { Course } from './course.entity';

/** Bảng classes — DDL docs/04-database-schema.md §6 (migration 1787800000004). */
@Entity('classes')
export class SchoolClass {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId!: string;

  @Column({ name: 'branch_id', type: 'uuid' })
  branchId!: string;

  @Column({ name: 'program_id', type: 'uuid' })
  programId!: string;

  @ManyToOne(() => Program, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'program_id' })
  program?: Program;

  @Column({ name: 'course_id', type: 'uuid' })
  courseId!: string;

  @ManyToOne(() => Course, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'course_id' })
  course?: Course;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 20, default: 'offline' })
  modality!: 'offline' | 'online' | 'hybrid' | 'flexible';

  @Column({ type: 'int', default: 20 })
  capacity!: number;

  @Column({ name: 'enrolled_count', type: 'int', default: 0 })
  enrolledCount!: number;

  @Column({ name: 'enrollment_status', type: 'varchar', length: 20, default: 'draft' })
  enrollmentStatus!: 'draft' | 'open' | 'closed' | 'full' | 'archived';

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate!: string | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate!: string | null;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status!: 'draft' | 'active' | 'archived';

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
