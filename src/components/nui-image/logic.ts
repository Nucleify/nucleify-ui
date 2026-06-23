import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { ImageFetchPriority, ImageFit, ImageLoading } from './types.js';

export interface NuiImageViewState {
  src: string;
  alt: string;
  width: string;
  height: string;
  fit: ImageFit | '';
  loading: ImageLoading | '';
  fetchpriority: ImageFetchPriority | '';
  preview: boolean;
  imageClass: string;
  imageStyle: string;
  nuiType: NuiType;
  previewVisible: boolean;
}

export interface NuiImageRenderHandlers {
  onPreviewOpen: (event: Event) => void;
  onPreviewClose: (event: Event) => void;
  onDialogClose: (event: Event) => void;
  onError: (event: Event) => void;
}

export function getImageWrapperClass(): string {
  return 'nui-image';
}

export function getImageClass(imageClass: string): string {
  return ['nui-image-img', imageClass].filter(Boolean).join(' ');
}

export function hasImageDimensions(
  state: Pick<NuiImageViewState, 'width' | 'height'>,
): boolean {
  return Boolean(state.width || state.height);
}

export function getImageInlineStyle(
  state: Pick<NuiImageViewState, 'width' | 'height' | 'imageStyle'>,
): string {
  const styles: string[] = [];

  if (state.width) {
    styles.push(`width:${state.width}`);
  }

  if (state.height) {
    styles.push(`height:${state.height}`);
  }

  if (state.imageStyle) {
    styles.push(state.imageStyle);
  }

  return styles.join(';');
}

export function renderImage(
  state: NuiImageViewState,
  handlers: NuiImageRenderHandlers,
): TemplateResult {
  const inlineStyle = getImageInlineStyle(state);
  const sized = hasImageDimensions(state);

  return html`
    <span
      class=${getImageWrapperClass()}
      nui-type=${state.nuiType || nothing}
      ?preview=${state.preview || nothing}
    >
      <img
        class=${getImageClass(state.imageClass)}
        src=${state.src || nothing}
        alt=${state.alt || nothing}
        loading=${state.loading || nothing}
        fetchpriority=${state.fetchpriority || nothing}
        fit=${state.fit || nothing}
        ?sized=${sized || nothing}
        style=${inlineStyle || nothing}
        @error=${handlers.onError}
      />
      ${
        state.preview
          ? html`
            <button
              class="nui-image-preview-trigger"
              type="button"
              aria-label="Preview image"
              @click=${handlers.onPreviewOpen}
            >
              <nui-icon
                class="nui-image-preview-icon"
                icon="mdi:eye"
                width="1.25em"
                height="1.25em"
                aria-hidden="true"
              ></nui-icon>
            </button>
          `
          : nothing
      }
      ${
        state.preview
          ? html`
            <dialog
              class="nui-image-mask"
              aria-label="Image preview"
              @close=${handlers.onDialogClose}
            >
              <img
                class="nui-image-preview"
                src=${state.src}
                alt=${state.alt || nothing}
                @click=${(event: Event) => event.stopPropagation()}
              />
              <button
                class="nui-image-close"
                type="button"
                aria-label="Close preview"
                @click=${handlers.onPreviewClose}
              >
                <nui-icon
                  icon="mdi:close"
                  width="1.25em"
                  height="1.25em"
                  aria-hidden="true"
                ></nui-icon>
              </button>
            </dialog>
          `
          : nothing
      }
    </span>
  `;
}
