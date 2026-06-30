import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { SelectOption } from './types.js';

export interface NuiSelectViewState {
  value: string;
  options: SelectOption[];
  placeholder: string;
  disabled: boolean;
  invalid: boolean;
  fluid: boolean;
  size: 'small' | '' | 'large';
  variant: '' | 'filled' | 'borderless';
  selectClass: string;
  open: boolean;
  nuiType: NuiType;
}

export interface NuiSelectHandlers {
  onToggle: () => void;
  onSelect: (value: string) => void;
  onKeydown: (e: KeyboardEvent) => void;
}

export function renderSelect(
  state: NuiSelectViewState,
  handlers: NuiSelectHandlers,
): TemplateResult {
  const getTriggerClass = () =>
    ['nui-select', state.selectClass].filter(Boolean).join(' ');

  const selectedLabel =
    state.options.find((o) => o.value === state.value)?.label ??
    state.placeholder;

  const hasValue = Boolean(state.value);

  return html`
    <div
      class="nui-select-wrapper"
      nui-type=${state.nuiType || nothing}
      aria-invalid=${state.invalid ? 'true' : nothing}
    >
      <button
        type="button"
        class=${getTriggerClass()}
        ?disabled=${state.disabled}
        aria-haspopup="listbox"
        aria-expanded=${state.open ? 'true' : 'false'}
        @click=${handlers.onToggle}
        @keydown=${handlers.onKeydown}
      >
        <span class="nui-select-label ${hasValue ? '' : 'nui-select-placeholder'}">
          ${selectedLabel || nothing}
        </span>
        <span class="nui-select-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </span>
      </button>

      ${
        state.open
          ? html`
            <ul
              class="nui-select-panel"
              role="listbox"
              aria-label="Options"
              @keydown=${handlers.onKeydown}
            >
              ${state.options.map(
                (opt) => html`
                  <li
                    class="nui-select-option"
                    role="option"
                    aria-selected=${state.value === opt.value ? 'true' : 'false'}
                    aria-disabled=${opt.disabled ? 'true' : nothing}
                    ?selected=${state.value === opt.value}
                    ?disabled=${opt.disabled ?? false}
                    @click=${() =>
                      !opt.disabled && handlers.onSelect(opt.value)}
                  >
                    ${opt.label}
                  </li>
                `,
              )}
            </ul>
          `
          : nothing
      }
    </div>
  `;
}
