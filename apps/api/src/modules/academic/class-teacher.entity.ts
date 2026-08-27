import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { SchoolClass } from './class.entity';

/** Bảng class_teachers (nối classes ↔ users) — DDL §6 (migration 1787800000004). */
@Entity('class_teachers')
export class ClassTeacher {
  @PrimaryColumn({ name: 'class_id', type: 'uuid' })
  classId!: string;

  @PrimaryColumn({ name: 'teacher_id', type: 'uuid' })
  teacherId!: string;

  @ManyToOne(() => SchoolClass, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class?: SchoolClass;

  @Column({ type: 'varchar', length: 50, default: 'primary' })
  role!: 'primary' | 'assistant' | 'substitute';
}
