import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';

/**
 * T006 deliverable: BullMQ queue 'default' hoạt động + endpoint thử nghiệm
 * POST /api/queue/test — worker/ tiêu thụ job.
 */
@Module({
  imports: [BullModule.registerQueue({ name: 'default' })],
  controllers: [QueueController],
})
export class QueueModule {}
