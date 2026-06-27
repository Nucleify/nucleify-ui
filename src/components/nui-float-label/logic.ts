import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { FloatLabelVariant } from './types.js';

export interface NuiFloatLabelViewState {
  variant: FloatLabelVariant;
  filled: boolean;
  focused: boolean;
  nuiType: NuiType;
  floatLabelClass: string;
}

export interface FloatLabelRenderHandlers {
  onSlotChange: () => void;
}

export function getFloatLabelClass(floatLabelClass: string): string {
  return ['nui-float-label', floatLabelClass].filter(Boolean).join(' ');
}

export function renderFloatLabel(
  state: NuiFloatLabelViewState,
  handlers: FloatLabelRenderHandlers,
): TemplateResult {
  return html`
    <div
      class=${getFloatLabelClass(state.floatLabelClass)}
      variant=${state.variant}
      nui-type=${state.nuiType || nothing}
      ?filled=${state.filled || nothing}
      ?focused=${state.focused || nothing}
    >
      <slot @slotchange=${handlers.onSlotChange}></slot>
    </div>
  `;
}
