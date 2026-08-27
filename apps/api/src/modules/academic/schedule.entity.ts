import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** Bảng schedules — DDL docs/04-database-schema.md §6 (migration 1787800000004).
 *  Chống trùng lịch (T039) implement chính xác ở service (teacher/room + weekday + time overlap). */
@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId!: string;

  @Column({ name: 'class_id', type: 'uuid' })
  classId!: string;

  @Column({ name: 'branch_id', type: 'uuid' })
  branchId!: string;

  @Column({ name: 'room_id', type: 'uuid', nullable: true })
  roomId!: string | null;

  @Column({ name: 'teacher_id', type: 'uuid' })
  teacherId!: string;

  @Column({ name: 'day_of_week', type: 'smallint' })
  dayOfWeek!: number;

  @Column({ name: 'start_time', type: 'time' })
  startTime!: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime!: string;

  @Column({ type: 'varchar', length: 20, default: 'weekly' })
  recurrence!: 'weekly' | 'biweekly' | 'once';

  @Column({ name: 'valid_from', type: 'date' })
  validFrom!: string;

  @Column({ name: 'valid_to', type: 'date', nullable: true })
  validTo!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
