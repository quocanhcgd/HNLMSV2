import { InjectQueue } from '@nestjs/bullmq';
import { Body, Controller, Post } from '@nestjs/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Queue } from 'bullmq';

export class EnqueueTestJobDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  message!: string;
}

@Controller('queue')
export class QueueController {
  constructor(@InjectQueue('default') private readonly queue: Queue) {}

  /**
   * POST /api/queue/test — đẩy 1 job thử nghiệm vào queue 'default'.
   * Worker (worker/) sẽ nhận và log. Phục vụ verify T006/T007.
   */
  @Post('test')
  async enqueue(@Body() dto: EnqueueTestJobDto) {
    const job = await this.queue.add(
      'test-job',
      { message: dto.message, enqueuedAt: new Date().toISOString() },
      { attempts: 3, removeOnComplete: 100 },
    );
    return { jobId: job.id, name: job.name, status: 'enqueued' };
  }
}
