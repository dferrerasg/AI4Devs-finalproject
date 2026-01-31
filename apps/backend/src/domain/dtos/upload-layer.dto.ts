export interface UploadLayerDto {
  planId: string;
  name: string;
  type: 'BASE' | 'OVERLAY';
  file: Express.Multer.File;
}
