import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { FileUploadItem, UploadMode } from './types.js';

export interface NuiFileUploadViewState {
  model: FileUploadItem[];
  mode: UploadMode;
  multiple: boolean;
  accept: string;
  disabled: boolean;
  auto: boolean;
  maxFileSize?: number;
  chooseLabel: string;
  uploadLabel: string;
  cancelLabel: string;
  chooseIcon: string;
  uploadIcon: string;
  cancelIcon: string;
  customUpload: boolean;
  unstyled: boolean;
  nuiType: NuiType;
  fileUploadClass: string;
  isUploading: boolean;
  uploadProgress: number;
  dragover: boolean;
}

export interface FileUploadRenderHandlers {
  onChooseClick: () => void;
  onUploadClick: () => void;
  onCancelClick: () => void;
  onRemoveItem: (id: string) => void;
  onInputChange: (e: Event) => void;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

function renderAdvanced(
  state: NuiFileUploadViewState,
  handlers: FileUploadRenderHandlers,
): TemplateResult {
  const hasFiles = state.model && state.model.length > 0;
  const showUploadButton = hasFiles && !state.auto;
  const showCancelButton = hasFiles && !state.auto;

  return html`
    <div
      class="nui-file-upload ${state.fileUploadClass}"
      nui-type=${state.nuiType || nothing}
    >
      <div class="nui-file-upload-header">
        <nui-button
          class="nui-file-upload-choose-btn"
          icon=${state.chooseIcon}
          label=${state.chooseLabel}
          ?disabled=${state.disabled || nothing}
          @click=${handlers.onChooseClick}
        ></nui-button>
        
        ${
          showUploadButton
            ? html`
              <nui-button
                class="nui-file-upload-upload-btn"
                icon=${state.uploadIcon}
                label=${state.uploadLabel}
                ?disabled=${state.disabled || state.isUploading || nothing}
                @click=${handlers.onUploadClick}
              ></nui-button>
            `
            : nothing
        }
          
        ${
          showCancelButton
            ? html`
              <nui-button
                class="nui-file-upload-cancel-btn"
                icon=${state.cancelIcon}
                label=${state.cancelLabel}
                variant="outlined"
                severity="secondary"
                ?disabled=${state.disabled || state.isUploading || nothing}
                @click=${handlers.onCancelClick}
              ></nui-button>
            `
            : nothing
        }

        ${
          state.isUploading
            ? html`
              <div class="nui-file-upload-progress">
                <nui-progress-bar
                  .value=${state.uploadProgress}
                  mode="determinate"
                  show-value
                ></nui-progress-bar>
              </div>
            `
            : nothing
        }
      </div>

      <div class="nui-file-upload-content">
        <input
          class="nui-file-upload-input"
          type="file"
          ?multiple=${state.multiple}
          accept=${state.accept || nothing}
          @change=${handlers.onInputChange}
        />

        ${
          !hasFiles
            ? html`
              <div
                class="nui-file-upload-empty"
                ?dragover=${state.dragover || nothing}
                @dragover=${handlers.onDragOver}
                @dragleave=${handlers.onDragLeave}
                @drop=${handlers.onDrop}
                @click=${handlers.onChooseClick}
              >
                <nui-icon
                  class="nui-file-upload-empty-icon"
                  icon="mdi:cloud-upload-outline"
                  width="1em"
                  height="1em"
                ></nui-icon>
                <div class="nui-file-upload-empty-text">
                  Drag and drop files here to upload.
                </div>
              </div>
            `
            : html`
              <div class="nui-file-upload-files">
                ${state.model.map(
                  (item) => html`
                    <div class="nui-file-upload-file-row">
                      ${
                        item.objectURL
                          ? html`
                            <img
                              class="nui-file-upload-thumbnail"
                              src=${item.objectURL}
                              alt=${item.name}
                            />
                          `
                          : html`
                            <nui-icon
                              class="nui-file-upload-thumbnail"
                              icon="mdi:file-document-outline"
                              width="50px"
                              height="50px"
                            ></nui-icon>
                          `
                      }
                      <div class="nui-file-upload-file-info">
                        <span class="nui-file-upload-file-name" title=${item.name}>
                          ${item.name}
                        </span>
                        <span class="nui-file-upload-file-size">
                          ${formatBytes(item.size)}
                        </span>
                      </div>
                      <span
                        class="nui-file-upload-file-status"
                        status=${item.status}
                      >
                        ${item.status}
                      </span>
                      <button
                        class="nui-file-upload-remove-btn"
                        ?disabled=${state.isUploading || nothing}
                        @click=${() => handlers.onRemoveItem(item.id)}
                      >
                        <nui-icon icon="mdi:close" width="1.25em" height="1.25em"></nui-icon>
                      </button>
                    </div>
                  `,
                )}
              </div>
            `
        }
      </div>
    </div>
  `;
}

function renderBasic(
  state: NuiFileUploadViewState,
  handlers: FileUploadRenderHandlers,
): TemplateResult {
  const hasFiles = state.model && state.model.length > 0;
  const fileName = hasFiles ? state.model[0].name : '';

  return html`
    <div
      class="nui-file-upload-basic ${state.fileUploadClass}"
      nui-type=${state.nuiType || nothing}
    >
      <input
        class="nui-file-upload-input"
        type="file"
        ?multiple=${state.multiple}
        accept=${state.accept || nothing}
        @change=${handlers.onInputChange}
      />
      <nui-button
        class="nui-file-upload-choose-btn"
        icon=${state.chooseIcon}
        label=${state.chooseLabel}
        ?disabled=${state.disabled || state.isUploading || nothing}
        @click=${handlers.onChooseClick}
      ></nui-button>
      
      ${
        hasFiles
          ? html`
            <span class="nui-file-upload-basic-info" title=${fileName}>
              ${fileName} (${formatBytes(state.model[0].size)})
            </span>
          `
          : nothing
      }
        
      ${
        state.isUploading
          ? html`
            <nui-icon
              icon="svg-spinners:90-ring-with-bg"
              width="1.25em"
              height="1.25em"
            ></nui-icon>
          `
          : nothing
      }
    </div>
  `;
}

export function renderFileUpload(
  state: NuiFileUploadViewState,
  handlers: FileUploadRenderHandlers,
): TemplateResult {
  if (state.mode === 'basic') {
    return renderBasic(state, handlers);
  }
  return renderAdvanced(state, handlers);
}
