import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LearningContent } from './learning-content.entity';

/** Bảng content_versions — lịch sử phiên bản file học liệu (DDL §7, migration 1787800000008). */
@Entity('content_versions')
export class ContentVersion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'content_id', type: 'uuid' })
  contentId!: string;

  @ManyToOne(() => LearningContent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_id' })
  content?: LearningContent;

  @Column({ type: 'int' })
  version!: number;

  @Column({ name: 'file_ref', type: 'varchar', length: 500, nullable: true })
  fileRef!: string | null;

  @Column({ name: 'file_hash', type: 'varchar', length: 64, nullable: true })
  fileHash!: string | null;

  @Column({ name: 'change_note', type: 'text', nullable: true })
  changeNote!: string | null;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
