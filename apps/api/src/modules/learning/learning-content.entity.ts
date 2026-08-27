import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { SchoolClass } from '../academic/class.entity';
import { User } from '../users/user.entity';
import { ContentClassLink } from './content-class-link.entity';

/** Bảng learning_content — DDL docs/04-database-schema.md §7 (migration 1787800000008). */
@Entity('learning_content')
export class LearningContent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId!: string;

  @Column({ name: 'branch_id', type: 'uuid', nullable: true })
  branchId!: string | null;

  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ name: 'content_type', type: 'varchar', length: 30 })
  contentType!: 'document' | 'video' | 'audio' | 'presentation' | 'interactive' | 'ebook';

  @Column({ name: 'access_scope', type: 'varchar', length: 20, default: 'class' })
  accessScope!: 'public' | 'class' | 'private';

  @Column({ type: 'varchar', length: 100, nullable: true })
  category!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subject!: string | null;

  @Column({ name: 'file_ref', type: 'varchar', length: 500, nullable: true })
  fileRef!: string | null;

  @Column({ name: 'file_size_bytes', type: 'bigint', nullable: true })
  fileSizeBytes!: number | null;

  @Column({ name: 'file_hash', type: 'varchar', length: 64, nullable: true })
  fileHash!: string | null;

  @Column({ name: 'mime_type', type: 'varchar', length: 100, nullable: true })
  mimeType!: string | null;

  @Column({ name: 'current_version', type: 'int', default: 1 })
  currentVersion!: number;

  @Column({ name: 'approval_status', type: 'varchar', length: 20, default: 'approved' })
  approvalStatus!: 'draft' | 'pending' | 'approved' | 'rejected';

  @Column({ type: 'varchar', length: 20, default: 'published' })
  status!: 'draft' | 'published' | 'archived';

  @Column({ name: 'usage_policy', type: 'jsonb', nullable: true })
  usagePolicy!: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt!: Date | null;

  /** Danh sách lớp được gán (content_class_links). */
  @OneToMany(() => ContentClassLink, (l) => l.content)
  classLinks?: ContentClassLink[];
  classes?: SchoolClass[];
}
