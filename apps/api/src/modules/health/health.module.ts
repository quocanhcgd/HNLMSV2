import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { HealthController } from './health.controller';

/**
 * T004 deliverable: API trả /api/health kèm trạng thái PostgreSQL + Redis.
 */
@Module({
  controllers: [HealthController],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Redis({
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
          lazyConnect: true,
        }),
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class HealthModule {}
