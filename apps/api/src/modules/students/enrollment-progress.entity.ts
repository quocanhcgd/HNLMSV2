import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Enrollment } from './enrollment.entity';

/** Bảng enrollment_progress — tiến độ học của 1 ghi danh (DDL §6, migration 1787800000006). */
@Entity('enrollment_progress')
export class EnrollmentProgress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'enrollment_id', type: 'uuid', unique: true })
  enrollmentId!: string;

  @OneToOne(() => Enrollment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'enrollment_id' })
  enrollment?: Enrollment;

  @Column({ name: 'progress_percent', type: 'numeric', precision: 5, scale: 2, default: 0 })
  progressPercent!: number;

  @Column({ name: 'completed_sessions', type: 'int', default: 0 })
  completedSessions!: number;

  @Column({ name: 'total_sessions', type: 'int', default: 0 })
  totalSessions!: number;

  @Column({ name: 'last_activity_at', type: 'timestamptz', nullable: true })
  lastActivityAt!: Date | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
