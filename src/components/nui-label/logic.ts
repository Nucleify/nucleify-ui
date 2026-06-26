import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { LabelSize } from './types.js';

export interface NuiLabelViewState {
  value: string;
  htmlFor: string;
  required: boolean;
  invalid: boolean;
  disabled: boolean;
  size: LabelSize | '';
  nuiType: NuiType;
  labelClass: string;
}

export function getLabelClass(labelClass: string): string {
  return ['nui-label', labelClass].filter(Boolean).join(' ');
}

export function renderLabel(state: NuiLabelViewState): TemplateResult {
  return html`
    <label
      class=${getLabelClass(state.labelClass)}
      for=${state.htmlFor || nothing}
      nui-type=${state.nuiType || nothing}
      size=${state.size || nothing}
      ?required=${state.required || nothing}
      ?invalid=${state.invalid || nothing}
      ?disabled=${state.disabled || nothing}
    >
      <slot>${state.value || nothing}</slot>
      ${
        state.required
          ? html`<span class="nui-label-required" aria-hidden="true">*</span>`
          : nothing
      }
    </label>
  `;
}
