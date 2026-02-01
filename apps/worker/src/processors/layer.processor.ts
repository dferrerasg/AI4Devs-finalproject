import { Job } from 'bullmq';
import { LayerStatus, LayerProcessingJob } from '@trace/core';
import prisma from '@/infrastructure/database/prisma';
import fs from 'fs';
import sharp from 'sharp';

export class LayerProcessor {
  async process(job: Job<LayerProcessingJob>) {
    const { layerId, fileUrl } = job.data;
    console.log(`[LayerProcessor] Starting job for layer: ${layerId}, fileStr: ${fileUrl}`);

    try {
      // 1. Update status to PROCESSING
      await prisma.layer.update({
        where: { id: layerId },
        data: { status: LayerStatus.PROCESSING },
      });

      // fileUrl is the absolute path from the backend
      const inputPath = fileUrl;

      if (!fs.existsSync(inputPath)) {
        console.error(`[LayerProcessor] File not found at: ${inputPath}`);
        throw new Error(`File not found: ${inputPath}`);
      }

      // 2. Process Image
      // Get metadata to ensure valid image
      const metadata = await sharp(inputPath).metadata();
      console.log(`[LayerProcessor] Image stats: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 3. Update status to READY (COMPLETED -> READY)
      await prisma.layer.update({
        where: { id: layerId },
        data: { status: LayerStatus.READY },
      });
      console.log(`[LayerProcessor] Job completed for layer ${layerId}`);

    } catch (error) {
      console.error(`[LayerProcessor] Job failed for layer ${layerId}:`, error);
      await prisma.layer.update({
        where: { id: layerId },
        data: { status: LayerStatus.ERROR },
      }).catch((err: any) => console.error("Failed to update layer status to ERROR", err));
      
      throw error; // Rethrow to let BullMQ know it failed
    }
  }
}
