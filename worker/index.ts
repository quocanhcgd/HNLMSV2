/**
 * lms-worker — BullMQ consumer (T007).
 * Chạy: pnpm --filter @lms/worker dev
 * Tiêu thụ queue 'default' mà apps/api đẩy job vào (POST /api/queue/test).
 */
import { Worker } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis({
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT ?? 6379),
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  'default',
  async (job) => {
    // eslint-disable-next-line no-console
    console.log(`[lms-worker] job ${job.id} (${job.name}) received:`, job.data);
    // TODO: route theo job.name sang handler tương ứng (email, invoice PDF, reconcile...)
    return { processedAt: new Date().toISOString() };
  },
  { connection },
);

worker.on('completed', (job) => {
  // eslint-disable-next-line no-console
  console.log(`[lms-worker] job ${job.id} completed`);
});
worker.on('failed', (job, err) => {
  // eslint-disable-next-line no-console
  console.error(`[lms-worker] job ${job?.id} failed:`, err.message);
});

// eslint-disable-next-line no-console
console.log('[lms-worker] started — listening on queue "default"');
