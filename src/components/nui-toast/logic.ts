import { html, nothing, type TemplateResult } from 'lit';
import type { NuiToastViewState, ToastMessage } from './types.js';

export interface NuiToastHandlers {
  onCloseClick: (id: string) => void;
}

function resolveIcon(severity: string | undefined): string {
  switch (severity) {
    case 'success':
      return 'mdi:check-circle';
    case 'info':
      return 'mdi:information';
    case 'warn':
      return 'mdi:alert';
    case 'error':
      return 'mdi:alert-circle';
    default:
      return 'mdi:information';
  }
}

function renderMessage(
  message: ToastMessage,
  handlers: NuiToastHandlers,
): TemplateResult {
  const severity = message.severity || 'info';
  const id = message.id || '';

  return html`
    <div
      class="nui-toast-message nui-toast-message-${severity} ${
        message.closing ? 'closing' : ''
      }"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="nui-toast-icon-container">
        <nui-icon icon=${resolveIcon(severity)} aria-hidden="true"></nui-icon>
      </div>
      <div class="nui-toast-text">
        ${
          message.summary
            ? html`<div class="nui-toast-summary">${message.summary}</div>`
            : nothing
        }
        ${
          message.detail
            ? html`<div class="nui-toast-detail">${message.detail}</div>`
            : nothing
        }
      </div>
      <button
        type="button"
        class="nui-toast-close-button"
        aria-label="Close"
        @click=${() => handlers.onCloseClick(id)}
      ><nui-icon icon="mdi:close" aria-hidden="true"></nui-icon></button>
    </div>
  `;
}

export function renderToast(
  state: NuiToastViewState,
  handlers: NuiToastHandlers,
): TemplateResult {
  return html`
    <div class="nui-toast-container">
      ${state.messages.map((msg) => renderMessage(msg, handlers))}
    </div>
  `;
}
