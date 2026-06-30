import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { RadioButtonSize, RadioButtonVariant } from './types.js';

export interface NuiRadioButtonViewState {
  checked: boolean;
  value: string;
  name: string;
  disabled: boolean;
  invalid: boolean;
  readonly: boolean;
  size: RadioButtonSize | '';
  variant: RadioButtonVariant | '';
  tabindex?: number;
  inputId: string;
  ariaLabel: string;
  ariaLabelledby: string;
  nuiType: NuiType;
  radioButtonClass: string;
}

export function getRadioButtonClass(radioButtonClass: string): string {
  return ['nui-radio-button', radioButtonClass].filter(Boolean).join(' ');
}

export interface NuiRadioButtonHandlers {
  onChange: (event: Event) => void;
  onClick: (event: Event) => void;
}

export function renderRadioButton(
  state: NuiRadioButtonViewState,
  handlers: NuiRadioButtonHandlers,
): TemplateResult {
  return html`
    <label
      class=${getRadioButtonClass(state.radioButtonClass)}
      size=${state.size || nothing}
      variant=${state.variant || nothing}
      nui-type=${state.nuiType || nothing}
      ?disabled=${state.disabled || nothing}
    >
      <input
        class="nui-radio-button-input"
        type="radio"
        id=${state.inputId || nothing}
        name=${state.name || nothing}
        value=${state.value || nothing}
        .checked=${state.checked}
        ?disabled=${state.disabled || nothing}
        ?readonly=${state.readonly || nothing}
        tabindex=${state.tabindex ?? nothing}
        aria-label=${state.ariaLabel || nothing}
        aria-labelledby=${state.ariaLabelledby || nothing}
        aria-invalid=${state.invalid ? 'true' : nothing}
        @change=${handlers.onChange}
        @click=${handlers.onClick}
      />
      <span
        class="nui-radio-button-box"
        ?checked=${state.checked || nothing}
        ?invalid=${state.invalid || nothing}
        ?disabled=${state.disabled || nothing}
      >
        <span class="nui-radio-button-icon"></span>
      </span>
    </label>
  `;
}
