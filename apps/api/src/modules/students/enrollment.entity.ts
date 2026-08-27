import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { SchoolClass } from '../academic/class.entity';
import { EnrollmentProgress } from './enrollment-progress.entity';
import { Student } from './student.entity';

/** Bảng enrollments — DDL docs/04-database-schema.md §6 (migration 1787800000006).
 *  Trigger sync_class_enrolled_count tự cập nhật classes.enrolled_count. */
@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId!: string;

  @Column({ name: 'branch_id', type: 'uuid' })
  branchId!: string;

  @Column({ name: 'student_id', type: 'uuid' })
  studentId!: string;

  @ManyToOne(() => Student, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'student_id' })
  student?: Student;

  @Column({ name: 'class_id', type: 'uuid' })
  classId!: string;

  @ManyToOne(() => SchoolClass, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'class_id' })
  class?: SchoolClass;

  @Column({ type: 'varchar', length: 30, default: 'pending_payment' })
  status!: 'pending_payment' | 'active' | 'completed' | 'dropped' | 'suspended' | 'waitlist';

  @Column({ name: 'enrolled_at', type: 'timestamptz', default: () => 'NOW()' })
  enrolledAt!: Date;

  @Column({ name: 'completion_state', type: 'varchar', length: 30, nullable: true })
  completionState!: string | null;

  @Column({ name: 'financial_account_ref', type: 'uuid', nullable: true })
  financialAccountRef!: string | null;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy!: string | null;

  @OneToOne(() => EnrollmentProgress, (p) => p.enrollment)
  progress?: EnrollmentProgress;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
