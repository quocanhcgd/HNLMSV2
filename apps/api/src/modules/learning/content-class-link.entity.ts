import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { SchoolClass } from '../academic/class.entity';
import { LearningContent } from './learning-content.entity';

/** Bảng content_class_links — học liệu ↔ lớp (DDL §7, migration 1787800000008). */
@Entity('content_class_links')
export class ContentClassLink {
  @PrimaryColumn({ name: 'content_id', type: 'uuid' })
  contentId!: string;

  @ManyToOne(() => LearningContent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_id' })
  content?: LearningContent;

  @PrimaryColumn({ name: 'class_id', type: 'uuid' })
  classId!: string;

  @ManyToOne(() => SchoolClass, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class?: SchoolClass;
}
