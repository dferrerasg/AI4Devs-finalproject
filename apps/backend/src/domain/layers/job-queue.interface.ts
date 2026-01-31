export interface LayerProcessingJob {
  layerId: string;
  fileUrl: string; // The "raw" file location
  originalFilename: string;
}

export interface IJobQueue {
  add(jobName: string, data: LayerProcessingJob): Promise<void>;
}
