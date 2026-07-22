import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiImageViewState, renderImage } from './logic.js';
import type { ImageFetchPriority, ImageFit, ImageLoading } from './types.js';

const styles = createComponentStyles(
  'nui-image',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-image')
export class NuiImage extends LitElement implements NuiImageViewState {
  @property({ type: String }) src = '';
  @property({ type: String }) alt = '';
  @property({ type: String }) width = '';
  @property({ type: String }) height = '';
  @property({ type: String }) fit: ImageFit | '' = '';
  @property({ type: String }) loading: ImageLoading | '' = '';
  @property({ type: String }) fetchpriority: ImageFetchPriority | '' = '';
  @property({ type: Boolean }) preview = false;
  @property({ type: String, attribute: 'image-class' }) imageClass = '';
  @property({ type: String, attribute: 'image-style' }) imageStyle = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @state() previewVisible = false;

  protected createRenderRoot() {
    const root = super.createRenderRoot();
    void styles.sync(root, { unstyled: this.unstyled });
    return root;
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('preview') && !this.preview) {
      this.closePreview();
    }

    if (changed.has('previewVisible')) {
      void this.syncPreviewDialog();
    }
  }

  private getPreviewDialog(): HTMLDialogElement | null {
    return this.renderRoot.querySelector('dialog.nui-image-mask');
  }

  private async syncPreviewDialog(): Promise<void> {
    await this.updateComplete;
    const dialog = this.getPreviewDialog();

    if (!dialog) {
      return;
    }

    if (this.previewVisible && !dialog.open) {
      dialog.showModal();
      return;
    }

    if (!this.previewVisible && dialog.open) {
      dialog.close();
    }
  }

  private closePreview(): void {
    this.previewVisible = false;
    this.getPreviewDialog()?.close();
  }

  private handlePreviewOpen = (event: Event): void => {
    event.stopPropagation();
    this.previewVisible = true;
  };

  private handlePreviewClose = (event: Event): void => {
    event.stopPropagation();
    const dialog = this.getPreviewDialog();

    if (dialog?.open) {
      dialog.close();
      return;
    }

    this.closePreview();
  };

  private handleDialogClose = (): void => {
    this.previewVisible = false;
  };

  private handleError = (event: Event): void => {
    this.dispatchEvent(
      new CustomEvent('error', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    return renderImage(
      {
        src: this.src,
        alt: this.alt,
        width: this.width,
        height: this.height,
        fit: this.fit,
        loading: this.loading,
        fetchpriority: this.fetchpriority,
        preview: this.preview,
        imageClass: this.imageClass,
        imageStyle: this.imageStyle,
        nuiType: this.nuiType,
        previewVisible: this.previewVisible,
      },
      {
        onPreviewOpen: this.handlePreviewOpen,
        onPreviewClose: this.handlePreviewClose,
        onDialogClose: this.handleDialogClose,
        onError: this.handleError,
      },
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-image': NuiImage;
  }
}
