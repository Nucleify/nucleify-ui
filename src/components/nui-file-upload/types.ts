export type UploadMode = 'advanced' | 'basic';

export interface FileUploadItem {
  id: string;
  file: File;
  name: string;
  size: number;
  objectURL?: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  progress: number;
}
