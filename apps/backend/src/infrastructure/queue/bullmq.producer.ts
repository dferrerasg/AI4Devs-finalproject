import { Queue } from 'bullmq';
import { IJobQueue, LayerProcessingJob } from '@/domain/layers/job-queue.interface';

// Warning: In production, reuse the Redis connection
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
};

export class BullMQProducer implements IJobQueue {
  private queue: Queue;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, { 
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000
        }
      }
    });
  }

  async add(jobName: string, data: LayerProcessingJob): Promise<void> {
    await this.queue.add(jobName, data);
  }
}
