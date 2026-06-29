import '../nui-icon/nui-icon.js';
import { html, nothing, type TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import type { NuiType } from '../../types/nui-type.js';

export interface NuiPopoverViewState {
  buttonText: string;
  icon: string;
  src: string;
  buttonClass: string;
  buttonStyle: string;
  popoverClass: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  nuiType: NuiType;
  open: boolean;
}

export interface PopoverRenderHandlers {
  onToggle: () => void;
}

function parseStyleString(styleStr: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!styleStr) {
    return result;
  }
  const rules = styleStr.split(';');
  for (const rule of rules) {
    const trimmed = rule.trim();
    if (!trimmed) {
      continue;
    }
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) {
      continue;
    }
    const key = trimmed.slice(0, colonIdx).trim();
    const val = trimmed.slice(colonIdx + 1).trim();
    if (key && val) {
      result[key] = val;
    }
  }
  return result;
}

export function renderPopover(
  state: NuiPopoverViewState,
  handlers: PopoverRenderHandlers,
): TemplateResult {
  const parsedButtonStyle = parseStyleString(state.buttonStyle);

  const getToggleButtonClass = () => {
    return ['nui-popover-toggle', state.buttonClass].filter(Boolean).join(' ');
  };

  const getPanelClass = () => {
    return ['nui-popover-panel', state.position, state.popoverClass]
      .filter(Boolean)
      .join(' ');
  };

  return html`
    <div class="nui-popover-wrapper" nui-type=${state.nuiType || nothing}>
      <button
        class=${getToggleButtonClass()}
        style=${styleMap(parsedButtonStyle)}
        type="button"
        @click=${handlers.onToggle}
        aria-expanded=${state.open ? 'true' : 'false'}
      >
        ${
          state.src
            ? html`<img class="nui-popover-toggle-image" src=${state.src} alt="" />`
            : nothing
        }
        ${
          state.icon
            ? html`<nui-icon class="nui-popover-toggle-icon" .icon=${state.icon}></nui-icon>`
            : nothing
        }
        ${state.buttonText ? html`<span>${state.buttonText}</span>` : nothing}
      </button>

      <div class=${getPanelClass()} ?hidden=${!state.open}>
        <div class="nui-popover-content">
          <slot></slot>
        </div>
      </div>
    </div>
  `;
}
