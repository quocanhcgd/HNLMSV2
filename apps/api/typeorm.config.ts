import 'reflect-metadata';
import { DataSource } from 'typeorm';

/**
 * DataSource dành cho TypeORM CLI (migration:generate/run/revert).
 * Ứng dụng chạy qua AppModule (TypeOrmModule.forRootAsync trong app.module.ts).
 * Migration chỉ tiến về trước (quy tắc 2.6 coding-rules).
 */
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL ?? 'postgresql://lms:lms_dev@127.0.0.1:5432/educ_lms',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
});
