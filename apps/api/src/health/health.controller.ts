import { Controller, Get, Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { DataSource } from 'typeorm';

interface HealthResponse {
  status: 'ok' | 'degraded';
  uptime: number;
  database: 'up' | 'down';
  redis: 'up' | 'down';
  timestamp: string;
}

@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  @Get()
  async check(): Promise<HealthResponse> {
    let database: HealthResponse['database'] = 'up';
    let redis: HealthResponse['redis'] = 'up';

    try {
      await this.dataSource.query('SELECT 1');
    } catch {
      database = 'down';
    }
    try {
      await this.redis.ping();
    } catch {
      redis = 'down';
    }

    return {
      status: database === 'up' && redis === 'up' ? 'ok' : 'degraded',
      uptime: Math.round(process.uptime()),
      database,
      redis,
      timestamp: new Date().toISOString(),
    };
  }
}
