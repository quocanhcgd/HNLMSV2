import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

/**
 * Bảng scope_grants — DDL chuẩn docs/04-database-schema.md §4.4.
 * Phạm vi truy cập theo branch/class/student; effective_to NULL = vô hạn.
 * branch_id/class_id/student_id chưa có FK (bảng branches T028, classes/students T038+ sau).
 * CHECK: phải có ít nhất 1 trong 3 cột đối tượng.
 */
@Entity('scope_grants')
export class ScopeGrant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId!: string;

  @Column({ name: 'branch_id', type: 'uuid', nullable: true })
  branchId!: string | null;

  @Column({ name: 'class_id', type: 'uuid', nullable: true })
  classId!: string | null;

  @Column({ name: 'student_id', type: 'uuid', nullable: true })
  studentId!: string | null;

  @Column({ name: 'effective_from', type: 'timestamptz', default: () => 'NOW()' })
  effectiveFrom!: Date;

  @Column({ name: 'effective_to', type: 'timestamptz', nullable: true })
  effectiveTo!: Date | null;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
