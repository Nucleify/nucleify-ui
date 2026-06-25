import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { TextareaSize, TextareaVariant } from './types.js';

export interface NuiTextareaViewState {
  value: string;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  invalid: boolean;
  required: boolean;
  name: string;
  textareaId: string;
  ariaLabel: string;
  ariaLabelledby: string;
  autocomplete: string;
  maxlength: number;
  minlength: number;
  rows: number;
  cols: number;
  autoResize: boolean;
  size: TextareaSize | '';
  variant: TextareaVariant | '';
  fluid: boolean;
  nuiType: NuiType;
  textareaClass: string;
}

export function getTextareaClass(textareaClass: string): string {
  return ['nui-textarea-input', textareaClass].filter(Boolean).join(' ');
}

export function renderTextarea(
  state: NuiTextareaViewState,
  handlers: {
    onInput: (event: Event) => void;
    onChange: (event: Event) => void;
  },
): TemplateResult {
  return html`
    <textarea
      class=${getTextareaClass(state.textareaClass)}
      id=${state.textareaId || nothing}
      name=${state.name || nothing}
      placeholder=${state.placeholder || nothing}
      .value=${state.value}
      autocomplete=${state.autocomplete || nothing}
      maxlength=${state.maxlength > 0 ? state.maxlength : nothing}
      minlength=${state.minlength > 0 ? state.minlength : nothing}
      rows=${state.rows > 0 ? state.rows : nothing}
      cols=${state.cols > 0 ? state.cols : nothing}
      ?disabled=${state.disabled || nothing}
      ?readonly=${state.readonly || nothing}
      ?required=${state.required || nothing}
      aria-label=${state.ariaLabel || nothing}
      aria-labelledby=${state.ariaLabelledby || nothing}
      aria-invalid=${state.invalid ? 'true' : nothing}
      @input=${handlers.onInput}
      @change=${handlers.onChange}
    ></textarea>
  `;
}
