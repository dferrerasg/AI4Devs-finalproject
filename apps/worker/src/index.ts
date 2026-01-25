import { Worker } from 'bullmq';
import { env } from '@/config/env';
import prisma from '@/infrastructure/database/prisma';
import { s3Client } from '@/infrastructure/storage/s3';

const startWorker = async () => {
  console.log('👷 Worker service starting...');

  try {
    // Basic connection test
    await prisma.$connect();
    console.log('✅ Database connected');

    // Example Worker definition
    const processingWorker = new Worker('processing-queue', async (job) => {
      console.log(`Job ${job.id} started processing...`);
      // TODO: Call processors here
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { status: 'completed' };
    }, {
      connection: {
        host: env.REDIS_HOST,
        port: parseInt(env.REDIS_PORT),
      },
      concurrency: env.CONCURRENCY,
    });

    processingWorker.on('completed', (job) => {
      console.log(`✅ Job ${job.id} has completed!`);
    });

    processingWorker.on('failed', (job, err) => {
      console.error(`❌ Job ${job?.id} has failed with ${err.message}`);
    });

    console.log(`🚀 Worker listening on queue: processing-queue with concurrency ${env.CONCURRENCY}`);

  } catch (error) {
    console.error('Failed to start worker:', error);
    process.exit(1);
  }
};

startWorker();
