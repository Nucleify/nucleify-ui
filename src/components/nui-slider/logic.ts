import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { SliderOrientation } from './types.js';

export interface NuiSliderViewState {
  value: number;
  valueHigh: number;
  min: number;
  max: number;
  step: number;
  range: boolean;
  orientation: SliderOrientation;
  disabled: boolean;
  tabindex: number;
  ariaLabel: string;
  ariaLabelledby: string;
  nuiType: NuiType;
  sliderClass: string;
}

export function getSliderClass(sliderClass: string): string {
  return ['nui-slider', sliderClass].filter(Boolean).join(' ');
}

export function clampSliderValue(
  value: number,
  min: number,
  max: number,
): number {
  if (max <= min) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

export function valueToPercent(
  value: number,
  min: number,
  max: number,
): number {
  if (max <= min) {
    return 0;
  }

  const clamped = clampSliderValue(value, min, max);

  return ((clamped - min) * 100) / (max - min);
}

export function renderSlider(state: NuiSliderViewState): TemplateResult {
  const low = clampSliderValue(state.value, state.min, state.max);
  const high = clampSliderValue(
    state.range ? state.valueHigh : state.value,
    state.min,
    state.max,
  );
  const lowPercent = valueToPercent(low, state.min, state.max);
  const highPercent = valueToPercent(high, state.min, state.max);
  const rangeStart = Math.min(lowPercent, highPercent);
  const rangeWidth = Math.abs(highPercent - lowPercent);
  const isHorizontal = state.orientation === 'horizontal';

  const rangeStyle = state.range
    ? isHorizontal
      ? `inset-inline-start: ${rangeStart}%; width: ${rangeWidth}%; height: 100%;`
      : `inset-inline-start: 0; width: 100%; bottom: ${rangeStart}%; height: ${rangeWidth}%;`
    : isHorizontal
      ? `inset-inline-start: 0; width: ${lowPercent}%; height: 100%;`
      : `inset-inline-start: 0; width: 100%; bottom: 0; height: ${lowPercent}%;`;

  const lowHandleStyle = isHorizontal
    ? `inset-inline-start: ${lowPercent}%;`
    : `bottom: ${lowPercent}%;`;

  const highHandleStyle = isHorizontal
    ? `inset-inline-start: ${highPercent}%;`
    : `bottom: ${highPercent}%;`;

  return html`
    <div
      class=${getSliderClass(state.sliderClass)}
      nui-type=${state.nuiType || nothing}
    >
      <div class="nui-slider-track">
        <div class="nui-slider-range" style=${rangeStyle}></div>
        <button
          type="button"
          class="nui-slider-handle"
          data-handle-index="0"
          style=${lowHandleStyle}
          tabindex=${state.disabled ? -1 : state.tabindex}
          role="slider"
          aria-label=${state.ariaLabel || nothing}
          aria-labelledby=${state.ariaLabelledby || nothing}
          aria-valuemin=${state.min}
          aria-valuemax=${state.max}
          aria-valuenow=${low}
          aria-disabled=${state.disabled ? 'true' : nothing}
          ?disabled=${state.disabled || nothing}
        ></button>
        ${
          state.range
            ? html`
                <button
                  type="button"
                  class="nui-slider-handle"
                  data-handle-index="1"
                  style=${highHandleStyle}
                  tabindex=${state.disabled ? -1 : state.tabindex}
                  role="slider"
                  aria-valuemin=${state.min}
                  aria-valuemax=${state.max}
                  aria-valuenow=${high}
                  aria-disabled=${state.disabled ? 'true' : nothing}
                  ?disabled=${state.disabled || nothing}
                ></button>
              `
            : nothing
        }
      </div>
    </div>
  `;
}
