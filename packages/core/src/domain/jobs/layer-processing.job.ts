export interface LayerProcessingJob {
  layerId: string;
  fileUrl: string; // The "raw" file location
  originalFilename: string;
  pageNumber?: number; // Check if PDF needs a specific page conversion
}
