import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { InputMaskSize, InputMaskVariant } from './types.js';

export interface NuiInputMaskViewState {
  value: string;
  mask: string;
  slotChar: string;
  autoClear: boolean;
  unmask: boolean;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  invalid: boolean;
  name: string;
  inputId: string;
  ariaLabel: string;
  ariaLabelledby: string;
  size: InputMaskSize | '';
  variant: InputMaskVariant | '';
  fluid: boolean;
  nuiType: NuiType;
  inputClass: string;
}

export function getInputClass(inputClass: string): string {
  return ['nui-input-mask-input', inputClass].filter(Boolean).join(' ');
}

export function renderInputMask(state: NuiInputMaskViewState): TemplateResult {
  return html`
    <input
      class=${getInputClass(state.inputClass)}
      type="text"
      id=${state.inputId || nothing}
      name=${state.name || nothing}
      placeholder=${state.placeholder || nothing}
      ?disabled=${state.disabled || nothing}
      ?readonly=${state.readonly || nothing}
      aria-label=${state.ariaLabel || nothing}
      aria-labelledby=${state.ariaLabelledby || nothing}
      aria-invalid=${state.invalid ? 'true' : nothing}
    />
  `;
}
