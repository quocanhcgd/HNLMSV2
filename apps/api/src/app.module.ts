import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { LicenseModule } from './modules/license/license.module';
import { QueueModule } from './modules/queue/queue.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('database.url'),
        autoLoadEntities: true,
        // Schema được quản lý bằng SQL (database/lms-schema.sql) + migration TypeORM.
        // synchronize=false theo quy tắc migration chỉ tiến về trước (coding-rules 2.6).
        synchronize: false,
        logging: config.get<string>('env') !== 'production',
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
        },
      }),
    }),
    AuthModule,
    HealthModule,
    LicenseModule,
    QueueModule,
    UsersModule,
  ],
})
export class AppModule {}
