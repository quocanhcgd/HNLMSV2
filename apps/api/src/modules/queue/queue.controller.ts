import { InjectQueue } from '@nestjs/bullmq';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Queue } from 'bullmq';
import { RequireRoles } from '../auth/authz.decorators';

export class EnqueueTestJobDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  message!: string;
}

@ApiTags('queue')
@ApiBearerAuth()
@RequireRoles('Admin') // T018: chỉ Admin mới được enqueue job thử nghiệm
@Controller('queue')
export class QueueController {
  constructor(@InjectQueue('default') private readonly queue: Queue) {}

  /**
   * POST /api/queue/test — đẩy 1 job thử nghiệm vào queue 'default'.
   * Worker (worker/) sẽ nhận và log. Phục vụ verify T006/T007.
   */
  @Post('test')
  @ApiOperation({ summary: 'Đẩy 1 job thử nghiệm vào queue default (Admin)' })
  async enqueue(@Body() dto: EnqueueTestJobDto) {
    const job = await this.queue.add(
      'test-job',
      { message: dto.message, enqueuedAt: new Date().toISOString() },
      { attempts: 3, removeOnComplete: 100 },
    );
    return { jobId: job.id, name: job.name, status: 'enqueued' };
  }
}
