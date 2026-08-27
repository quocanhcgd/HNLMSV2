import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LearningContent } from './learning-content.entity';
import { Student } from '../students/student.entity';

/** Bảng content_progress — tiến độ học viên trên từng học liệu (DDL §7, migration 1787800000010). */
@Entity('content_progress')
export class ContentProgress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'content_id', type: 'uuid' })
  contentId!: string;

  @ManyToOne(() => LearningContent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_id' })
  content?: LearningContent;

  @Column({ name: 'student_id', type: 'uuid' })
  studentId!: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student?: Student;

  @Column({ name: 'progress_percent', type: 'numeric', precision: 5, scale: 2, default: 0 })
  progressPercent!: number;

  @Column({ name: 'watch_seconds', type: 'int', default: 0 })
  watchSeconds!: number;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted!: boolean;

  @Column({ name: 'first_viewed_at', type: 'timestamptz', nullable: true })
  firstViewedAt!: Date | null;

  @Column({ name: 'last_viewed_at', type: 'timestamptz', nullable: true })
  lastViewedAt!: Date | null;
}
