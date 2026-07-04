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

export interface FileUploadRemoveDetail {
  file?: File;
}

export interface FileUploadBeforeUploadDetail {
  files: File[];
}

export interface FileUploadUploaderOptions {
  clear: () => void;
  setProgress: (progress: number) => void;
  setFileProgress: (id: string, progress: number) => void;
  setFileStatus: (id: string, status: FileUploadItem['status']) => void;
}

export interface FileUploadUploaderDetail {
  files: File[];
  options: FileUploadUploaderOptions;
}

export interface FileUploadUploadDetail {
  xhr?: XMLHttpRequest;
  files?: File[];
}

export type FileUploadErrorType = 'xhr' | 'limit' | 'size' | 'type';

export interface FileUploadErrorDetail {
  xhr?: XMLHttpRequest;
  file?: File;
  message?: string;
  type: FileUploadErrorType;
}

export interface FileUploadSelectDetail {
  files: File[];
  originalFiles: FileList | File[];
}

export interface NuiFileUploadEventMap {
  remove: CustomEvent<FileUploadRemoveDetail>;
  clear: CustomEvent;
  'before-upload': CustomEvent<FileUploadBeforeUploadDetail>;
  uploader: CustomEvent<FileUploadUploaderDetail>;
  upload: CustomEvent<FileUploadUploadDetail>;
  error: CustomEvent<FileUploadErrorDetail>;
  select: CustomEvent<FileUploadSelectDetail>;
}
