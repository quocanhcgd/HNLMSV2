import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** Bảng rooms — DDL docs/04-database-schema.md §6 (migration 1787800000004). DDL KHÔNG có created_at. */
@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId!: string;

  @Column({ name: 'branch_id', type: 'uuid' })
  branchId!: string;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name!: string | null;

  @Column({ type: 'int', nullable: true })
  capacity!: number | null;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status!: 'active' | 'inactive';
}
