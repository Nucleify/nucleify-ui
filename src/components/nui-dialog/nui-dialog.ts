import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { slotHasContent } from './dialog-slots.js';
import { type NuiDialogViewState, renderDialog } from './logic.js';
import type { DialogPosition } from './types.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-dialog')
export class NuiDialog extends LitElement implements NuiDialogViewState {
  @property({ type: Boolean, reflect: true }) visible = false;
  @property({ type: String }) header = '';
  @property({ type: String }) footer = '';
  @property({ type: Boolean, reflect: true }) modal = true;
  @property({ type: Boolean, reflect: true }) closable = true;
  @property({ type: Boolean, attribute: 'close-on-escape' }) closeOnEscape =
    true;
  @property({ type: Boolean, attribute: 'dismissable-mask' })
  dismissableMask = false;
  @property({ type: String, reflect: true }) position: DialogPosition =
    'center';
  @property({ type: String }) width = '32rem';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'dialog-class' }) dialogClass = '';

  @state() hasHeaderSlot = false;
  @state() hasFooterSlot = false;

  private wasVisible = false;

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    void this.syncDialogOpenState();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('visible')) {
      void this.syncDialogOpenState();
    }
  }

  private getDialogElement(): HTMLDialogElement | null {
    return this.renderRoot.querySelector('dialog.nui-dialog');
  }

  private async syncDialogOpenState(): Promise<void> {
    await this.updateComplete;
    const dialog = this.getDialogElement();

    if (!dialog) {
      return;
    }

    if (this.visible && !dialog.open) {
      if (this.modal) {
        dialog.showModal();
      } else {
        dialog.show();
      }

      if (!this.wasVisible) {
        this.wasVisible = true;

        this.dispatchEvent(
          new CustomEvent('show', {
            bubbles: true,
            composed: true,
          }),
        );
      }

      return;
    }

    if (!this.visible && dialog.open) {
      dialog.close();
    }
  }

  private emitClose(event?: Event): void {
    if (!this.visible && !this.wasVisible) {
      return;
    }

    this.visible = false;
    this.wasVisible = false;

    this.dispatchEvent(
      new CustomEvent('hide', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { visible: false, originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private requestClose(event?: Event): void {
    if (!this.visible) {
      return;
    }

    const dialog = this.getDialogElement();

    if (dialog?.open) {
      dialog.close();
      return;
    }

    this.emitClose(event);
  }

  private handleDialogClick = (event: Event): void => {
    if (event.target !== event.currentTarget || !this.dismissableMask) {
      return;
    }

    this.requestClose(event);
  };

  private handleDialogClose = (event: Event): void => {
    this.emitClose(event);
  };

  private handleDialogCancel = (event: Event): void => {
    if (!this.closeOnEscape) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    this.requestClose(event);
  };

  private handleCloseClick = (event: Event): void => {
    event.preventDefault();
    this.requestClose(event);
  };

  private handleHeaderSlotChange = (event: Event): void => {
    this.hasHeaderSlot = slotHasContent(event.target as HTMLSlotElement);
  };

  private handleFooterSlotChange = (event: Event): void => {
    this.hasFooterSlot = slotHasContent(event.target as HTMLSlotElement);
  };

  render() {
    return renderDialog(this, {
      onDialogClick: this.handleDialogClick,
      onDialogClose: this.handleDialogClose,
      onDialogCancel: this.handleDialogCancel,
      onCloseClick: this.handleCloseClick,
      onHeaderSlotChange: this.handleHeaderSlotChange,
      onFooterSlotChange: this.handleFooterSlotChange,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-dialog': NuiDialog;
  }
}
