import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { formatBytes, renderFileUpload } from './logic.js';
import type { FileUploadItem, UploadMode } from './types.js';

const styles = createComponentStyles(
  'nui-file-upload',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-file-upload')
export class NuiFileUpload extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String }) url = '';
  @property({ type: String }) mode: UploadMode = 'advanced';
  @property({ type: Boolean }) multiple = false;
  @property({ type: String }) accept = '';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) auto = false;
  @property({ type: Number, attribute: 'max-file-size' }) maxFileSize?: number;
  @property({ type: String, attribute: 'choose-label' }) chooseLabel = 'Choose';
  @property({ type: String, attribute: 'upload-label' }) uploadLabel = 'Upload';
  @property({ type: String, attribute: 'cancel-label' }) cancelLabel = 'Cancel';
  @property({ type: String, attribute: 'choose-icon' }) chooseIcon = 'mdi:plus';
  @property({ type: String, attribute: 'upload-icon' }) uploadIcon =
    'mdi:upload';
  @property({ type: String, attribute: 'cancel-icon' }) cancelIcon =
    'mdi:close';
  @property({ type: Boolean, attribute: 'custom-upload' }) customUpload = false;
  @property({ type: String, attribute: 'invalid-file-size-message' })
  invalidFileSizeMessage = '';
  @property({ type: Number, attribute: 'file-limit' }) fileLimit?: number;
  @property({ type: String, attribute: 'invalid-file-limit-message' })
  invalidFileLimitMessage = '';
  @property({ type: String, attribute: 'file-upload-class' }) fileUploadClass =
    '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';

  @state() private files: FileUploadItem[] = [];
  @state() private dragover = false;
  @state() private isUploading = false;
  @state() private uploadProgress = 0;

  @query('.nui-file-upload-input') private fileInput?: HTMLInputElement;

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.clearObjectURLs();
  }

  private clearObjectURLs() {
    for (const item of this.files) {
      if (item.objectURL) {
        URL.revokeObjectURL(item.objectURL);
      }
    }
  }

  private handleChooseClick = () => {
    if (this.disabled || this.isUploading) return;
    this.fileInput?.click();
  };

  private handleInputChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this.handleFilesSelection(input.files);
    // Reset inputs so the same file can be selected again
    input.value = '';
  };

  private handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (this.disabled || this.isUploading) return;
    this.dragover = true;
  };

  private handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    this.dragover = false;
  };

  private handleDrop = (e: DragEvent) => {
    e.preventDefault();
    this.dragover = false;
    if (this.disabled || this.isUploading) return;

    const files = e.dataTransfer?.files || null;
    this.handleFilesSelection(files);
  };

  private handleRemoveItem = (id: string) => {
    const fileToRemove = this.files.find((f) => f.id === id);
    if (fileToRemove?.objectURL) {
      URL.revokeObjectURL(fileToRemove.objectURL);
    }
    this.files = this.files.filter((f) => f.id !== id);
    this.dispatchEvent(
      new CustomEvent('remove', { detail: { file: fileToRemove?.file } }),
    );
  };

  private handleCancelClick = () => {
    this.clear();
  };

  public clear() {
    this.clearObjectURLs();
    this.files = [];
    this.isUploading = false;
    this.uploadProgress = 0;
    this.dispatchEvent(new CustomEvent('clear'));
  }

  public handleUploadClick = () => {
    this.upload();
  };

  public upload() {
    if (this.files.length === 0 || this.isUploading) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    this.files = this.files.map((f) =>
      f.status === 'pending' ? { ...f, status: 'uploading' } : f,
    );

    this.dispatchEvent(
      new CustomEvent('before-upload', {
        detail: { files: this.files.map((f) => f.file) },
      }),
    );

    if (this.customUpload) {
      this.dispatchEvent(
        new CustomEvent('uploader', {
          detail: {
            files: this.files.map((f) => f.file),
            options: {
              clear: () => this.clear(),
              setProgress: (progress: number) => {
                this.uploadProgress = progress;
              },
              setFileProgress: (id: string, progress: number) => {
                this.files = this.files.map((f) =>
                  f.id === id ? { ...f, progress } : f,
                );
              },
              setFileStatus: (id: string, status: FileUploadItem['status']) => {
                this.files = this.files.map((f) =>
                  f.id === id ? { ...f, status } : f,
                );
              },
            },
          },
        }),
      );
      return;
    }

    if (this.url) {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      for (const item of this.files) {
        if (item.status === 'uploading') {
          formData.append(this.name || 'files', item.file, item.name);
        }
      }

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          this.uploadProgress = Math.round((e.loaded * 100) / e.total);
          this.files = this.files.map((f) =>
            f.status === 'uploading'
              ? { ...f, progress: this.uploadProgress }
              : f,
          );
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          this.files = this.files.map((f) =>
            f.status === 'uploading'
              ? { ...f, status: 'completed', progress: 100 }
              : f,
          );
          this.isUploading = false;
          this.dispatchEvent(new CustomEvent('upload', { detail: { xhr } }));
        } else {
          this.files = this.files.map((f) =>
            f.status === 'uploading' ? { ...f, status: 'failed' } : f,
          );
          this.isUploading = false;
          this.dispatchEvent(
            new CustomEvent('error', { detail: { xhr, type: 'xhr' } }),
          );
        }
      });

      xhr.addEventListener('error', () => {
        this.files = this.files.map((f) =>
          f.status === 'uploading' ? { ...f, status: 'failed' } : f,
        );
        this.isUploading = false;
        this.dispatchEvent(
          new CustomEvent('error', { detail: { xhr, type: 'xhr' } }),
        );
      });

      xhr.open('POST', this.url, true);
      xhr.send(formData);
    } else {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        this.uploadProgress = progress;
        this.files = this.files.map((f) =>
          f.status === 'uploading' ? { ...f, progress } : f,
        );

        if (progress >= 100) {
          clearInterval(interval);
          this.files = this.files.map((f) =>
            f.status === 'uploading'
              ? { ...f, status: 'completed', progress: 100 }
              : f,
          );
          this.isUploading = false;
          this.dispatchEvent(
            new CustomEvent('upload', {
              detail: { files: this.files.map((f) => f.file) },
            }),
          );
        }
      }, 200);
    }
  }

  private handleFilesSelection(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const newFiles: File[] = Array.from(fileList);
    const validItems: FileUploadItem[] = [];

    if (
      this.fileLimit &&
      this.files.length + newFiles.length > this.fileLimit
    ) {
      const message = this.invalidFileLimitMessage
        ? this.invalidFileLimitMessage.replace('{0}', String(this.fileLimit))
        : `Maximum number of files exceeded, limit is ${this.fileLimit}.`;
      this.dispatchEvent(
        new CustomEvent('error', { detail: { message, type: 'limit' } }),
      );
      return;
    }

    for (const file of newFiles) {
      if (this.maxFileSize && file.size > this.maxFileSize) {
        const message = this.invalidFileSizeMessage
          ? this.invalidFileSizeMessage
              .replace('{0}', file.name)
              .replace('{1}', formatBytes(this.maxFileSize))
          : `${file.name}: Invalid file size, file size should be smaller than ${formatBytes(this.maxFileSize)}.`;
        this.dispatchEvent(
          new CustomEvent('error', { detail: { file, message, type: 'size' } }),
        );
        continue;
      }

      if (this.accept) {
        const acceptedTypes = this.accept.split(',').map((t) => t.trim());
        const fileType = file.type;
        const fileName = file.name;
        const matches = acceptedTypes.some((acceptType) => {
          if (acceptType.startsWith('.')) {
            return fileName.endsWith(acceptType);
          }
          if (acceptType.endsWith('/*')) {
            const baseType = acceptType.replace('/*', '');
            return fileType.startsWith(baseType);
          }
          return fileType === acceptType;
        });

        if (!matches) {
          const message = `Invalid file type for ${file.name}.`;
          this.dispatchEvent(
            new CustomEvent('error', {
              detail: { file, message, type: 'type' },
            }),
          );
          continue;
        }
      }

      const isImage = file.type.startsWith('image/');
      validItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        objectURL: isImage ? URL.createObjectURL(file) : undefined,
        status: 'pending',
        progress: 0,
      });
    }

    if (validItems.length > 0) {
      this.files = this.multiple ? [...this.files, ...validItems] : validItems;
      this.dispatchEvent(
        new CustomEvent('select', {
          detail: {
            files: validItems.map((item) => item.file),
            originalFiles: newFiles,
          },
        }),
      );

      if (this.auto) {
        this.upload();
      }
    }
  }

  render() {
    const viewState = {
      model: this.files,
      mode: this.mode,
      multiple: this.multiple,
      accept: this.accept,
      disabled: this.disabled,
      auto: this.auto,
      maxFileSize: this.maxFileSize,
      chooseLabel: this.chooseLabel,
      uploadLabel: this.uploadLabel,
      cancelLabel: this.cancelLabel,
      chooseIcon: this.chooseIcon,
      uploadIcon: this.uploadIcon,
      cancelIcon: this.cancelIcon,
      customUpload: this.customUpload,
      unstyled: this.unstyled,
      nuiType: this.nuiType,
      fileUploadClass: this.fileUploadClass,
      isUploading: this.isUploading,
      uploadProgress: this.uploadProgress,
      dragover: this.dragover,
    };

    const renderHandlers = {
      onChooseClick: this.handleChooseClick,
      onUploadClick: this.handleUploadClick,
      onCancelClick: this.handleCancelClick,
      onRemoveItem: this.handleRemoveItem,
      onInputChange: this.handleInputChange,
      onDragOver: this.handleDragOver,
      onDragLeave: this.handleDragLeave,
      onDrop: this.handleDrop,
    };

    return renderFileUpload(viewState, renderHandlers);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-file-upload': NuiFileUpload;
  }
}
