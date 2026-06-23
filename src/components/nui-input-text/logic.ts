import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type {
  InputTextSize,
  InputTextType,
  InputTextVariant,
} from './types.js';

export interface NuiInputTextViewState {
  value: string;
  type: InputTextType;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  invalid: boolean;
  required: boolean;
  name: string;
  inputId: string;
  ariaLabel: string;
  ariaLabelledby: string;
  autocomplete: string;
  maxlength: number;
  minlength: number;
  size: InputTextSize | '';
  variant: InputTextVariant | '';
  fluid: boolean;
  nuiType: NuiType;
  inputClass: string;
}

export function getInputClass(inputClass: string): string {
  return ['nui-input-text-input', inputClass].filter(Boolean).join(' ');
}

export function renderInputText(
  state: NuiInputTextViewState,
  handlers: {
    onInput: (event: Event) => void;
    onChange: (event: Event) => void;
  },
): TemplateResult {
  return html`
    <input
      class=${getInputClass(state.inputClass)}
      type=${state.type}
      id=${state.inputId || nothing}
      name=${state.name || nothing}
      placeholder=${state.placeholder || nothing}
      .value=${state.value}
      autocomplete=${state.autocomplete || nothing}
      maxlength=${state.maxlength > 0 ? state.maxlength : nothing}
      minlength=${state.minlength > 0 ? state.minlength : nothing}
      ?disabled=${state.disabled || nothing}
      ?readonly=${state.readonly || nothing}
      ?required=${state.required || nothing}
      aria-label=${state.ariaLabel || nothing}
      aria-labelledby=${state.ariaLabelledby || nothing}
      aria-invalid=${state.invalid ? 'true' : nothing}
      @input=${handlers.onInput}
      @change=${handlers.onChange}
    />
  `;
}
