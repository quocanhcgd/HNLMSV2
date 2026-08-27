import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entity users — khớp bảng `users` (database/lms-schema.sql).
 * Quy ước: không xóa vật lý (soft delete qua `deleted_at`), UUID PK.
 * DDL chuẩn: docs/04-database-schema.md §4.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  /** select:false — chỉ lấy khi cần (xem UsersService.findByEmailWithPassword). */
  @Column({ name: 'password_hash', type: 'varchar', length: 255, select: false })
  passwordHash!: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName!: string;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
  avatarUrl!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone!: string | null;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  gender!: 'Male' | 'Female' | 'Other' | 'PreferNotToSay' | null;

  /** Student | Teacher | Admin (CHECK trong DB). */
  @Column({ type: 'varchar', length: 50 })
  role!: string;

  /** Active | Inactive | Suspended | Deleted (CHECK trong DB). */
  @Column({ type: 'varchar', length: 50, default: 'Active' })
  status!: string;

  @Column({ name: 'email_verified', type: 'boolean', default: false })
  emailVerified!: boolean;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt!: Date | null;

  @Column({ name: 'two_fa_enabled', type: 'boolean', default: false })
  twoFaEnabled!: boolean;

  @Column({ name: 'two_fa_secret', type: 'varchar', length: 255, nullable: true })
  twoFaSecret!: string | null;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt!: Date | null;

  @Column({ name: 'last_login_ip', type: 'inet', nullable: true })
  lastLoginIp!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt!: Date | null;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt!: Date | null;
}
