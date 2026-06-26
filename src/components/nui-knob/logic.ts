import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import { formatKnobValue, getKnobPaths } from './knob-math.js';

export interface NuiKnobViewState {
  value: number;
  min: number;
  max: number;
  size: number;
  strokeWidth: number;
  showValue: boolean;
  valueTemplate: string;
  valueColor: string;
  rangeColor: string;
  textColor: string;
  disabled: boolean;
  readonly: boolean;
  tabindex: number;
  ariaLabel: string;
  ariaLabelledby: string;
  nuiType: NuiType;
  knobClass: string;
}

export function getKnobClass(knobClass: string): string {
  return ['nui-knob', knobClass].filter(Boolean).join(' ');
}

export function renderKnob(state: NuiKnobViewState): TemplateResult {
  const paths = getKnobPaths(state.value, state.min, state.max);
  const valueStroke = state.valueColor || 'var(--nui-primary-color)';
  const rangeStroke = state.rangeColor || 'var(--nui-card-border)';
  const textStyle = state.textColor ? `color: ${state.textColor}` : nothing;

  return html`
    <div class=${getKnobClass(state.knobClass)} nui-type=${state.nuiType || nothing}>
      <svg
        class="nui-knob-svg"
        width=${state.size}
        height=${state.size}
        viewBox="0 0 100 100"
        role="slider"
        aria-label=${state.ariaLabel || nothing}
        aria-labelledby=${state.ariaLabelledby || nothing}
        aria-valuemin=${state.min}
        aria-valuemax=${state.max}
        aria-valuenow=${state.value}
        aria-disabled=${state.disabled ? 'true' : nothing}
        aria-readonly=${state.readonly ? 'true' : nothing}
        tabindex=${state.disabled ? -1 : state.tabindex}
      >
        <path
          class="nui-knob-range"
          d=${paths.rangePath}
          stroke=${rangeStroke}
          stroke-width=${state.strokeWidth}
        ></path>
        <path
          class="nui-knob-value"
          d=${paths.valuePath}
          stroke=${valueStroke}
          stroke-width=${state.strokeWidth}
        ></path>
      </svg>
      ${
        state.showValue
          ? html`
              <span class="nui-knob-text" style=${textStyle}>
                ${formatKnobValue(state.value, state.valueTemplate)}
              </span>
            `
          : nothing
      }
    </div>
  `;
}
