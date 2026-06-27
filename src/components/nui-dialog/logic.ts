import '../nui-heading/nui-heading.js';
import '../nui-icon/nui-icon.js';
import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { DialogPosition } from './types.js';

export interface NuiDialogViewState {
  visible: boolean;
  header: string;
  footer: string;
  modal: boolean;
  closable: boolean;
  dismissableMask: boolean;
  position: DialogPosition;
  width: string;
  dialogClass: string;
  nuiType: NuiType;
  hasHeaderSlot: boolean;
  hasFooterSlot: boolean;
}

export interface DialogRenderHandlers {
  onDialogClick: (event: Event) => void;
  onDialogClose: (event: Event) => void;
  onDialogCancel: (event: Event) => void;
  onCloseClick: (event: Event) => void;
  onHeaderSlotChange: (event: Event) => void;
  onFooterSlotChange: (event: Event) => void;
}

export function getDialogClass(dialogClass: string): string {
  return ['nui-dialog', dialogClass].filter(Boolean).join(' ');
}

function shouldShowHeader(state: NuiDialogViewState): boolean {
  return Boolean(state.header || state.hasHeaderSlot || state.closable);
}

function shouldShowFooter(state: NuiDialogViewState): boolean {
  return Boolean(state.footer || state.hasFooterSlot);
}

export function renderDialog(
  state: NuiDialogViewState,
  handlers: DialogRenderHandlers,
): TemplateResult {
  const showHeader = shouldShowHeader(state);
  const showFooter = shouldShowFooter(state);

  return html`
    <dialog
      class=${getDialogClass(state.dialogClass)}
      nui-type=${state.nuiType || nothing}
      position=${state.position}
      style=${state.width ? `--nui-dialog-width: ${state.width}` : nothing}
      aria-labelledby=${showHeader ? 'nui-dialog-title' : nothing}
      @click=${handlers.onDialogClick}
      @close=${handlers.onDialogClose}
      @cancel=${handlers.onDialogCancel}
    >
      <div class="nui-dialog-panel" @click=${(event: Event) => event.stopPropagation()}>
        <div class="nui-dialog-header" ?hidden=${!showHeader}>
          <div class="nui-dialog-title" id="nui-dialog-title">
            <slot name="header" @slotchange=${handlers.onHeaderSlotChange}>
              ${
                state.header
                  ? html`
                      <nui-heading
                        class="nui-dialog-title-text"
                        tag="3"
                        text=${state.header}
                        nui-type=${state.nuiType || nothing}
                        unstyled
                      ></nui-heading>
                    `
                  : nothing
              }
            </slot>
          </div>
          ${
            state.closable
              ? html`
                  <button
                    type="button"
                    class="nui-dialog-close"
                    aria-label="Close dialog"
                    @click=${handlers.onCloseClick}
                  >
                    <nui-icon
                      icon="mdi:close"
                      width="1.25em"
                      height="1.25em"
                      aria-hidden="true"
                    ></nui-icon>
                  </button>
                `
              : nothing
          }
        </div>
        <div class="nui-dialog-content">
          <slot></slot>
        </div>
        <div class="nui-dialog-footer" ?hidden=${!showFooter}>
          <slot name="footer" @slotchange=${handlers.onFooterSlotChange}>
            ${state.footer ? html`<span>${state.footer}</span>` : nothing}
          </slot>
        </div>
      </div>
    </dialog>
  `;
}
