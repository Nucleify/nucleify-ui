import '../nui-icon/nui-icon.js';
import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { MeterItem } from './types.js';

export interface NuiMeterGroupViewState {
  value: MeterItem[];
  min: number;
  max: number;
  orientation: 'horizontal' | 'vertical';
  labelPosition: 'start' | 'end' | 'none';
  labelOrientation: 'horizontal' | 'vertical';
  unstyled: boolean;
  nuiType: NuiType;
  meterGroupClass: string;
}

function getMeterGroupClass(state: NuiMeterGroupViewState): string {
  return ['nui-meter-group', state.meterGroupClass].filter(Boolean).join(' ');
}

export function renderMeterGroup(
  state: NuiMeterGroupViewState,
): TemplateResult {
  const min = state.min;
  const max = state.max;
  const range = max - min > 0 ? max - min : 100;
  const items = state.value || [];

  // Calculate percentages
  const calculatedItems = items.map((item) => {
    const percent = Math.max(0, (item.value / range) * 100);
    return {
      ...item,
      percent,
    };
  });

  const renderMeters = () => html`
    <div class="nui-meter-group-meters">
      ${calculatedItems.map((item) => {
        const style =
          state.orientation === 'vertical'
            ? `height: ${item.percent}%; background-color: ${item.color || 'var(--nui-primary-color)'};`
            : `width: ${item.percent}%; background-color: ${item.color || 'var(--nui-primary-color)'};`;

        return html`
          <div
            class="nui-meter-group-meter"
            style=${style}
            role="progressbar"
            aria-valuemin=${min}
            aria-valuemax=${max}
            aria-valuenow=${item.value}
            aria-label=${item.label || nothing}
          ></div>
        `;
      })}
    </div>
  `;

  const renderLabels = () => {
    if (state.labelPosition === 'none' || calculatedItems.length === 0) {
      return nothing;
    }

    return html`
      <ol class="nui-meter-group-labels" label-orientation=${state.labelOrientation}>
        ${calculatedItems.map(
          (item) => html`
          <li class="nui-meter-group-label-item">
            ${
              item.icon
                ? html`
                  <nui-icon
                    class="nui-meter-group-label-icon"
                    .icon=${item.icon}
                    style=${`color: ${item.color || 'var(--nui-primary-color)'}`}
                  ></nui-icon>
                `
                : html`
                  <span
                    class="nui-meter-group-label-marker"
                    style=${`background-color: ${item.color || 'var(--nui-primary-color)'}`}
                  ></span>
                `
            }
            <span class="nui-meter-group-label-text">${item.label}</span>
            <span class="nui-meter-group-label-value">(${item.value}%)</span>
          </li>
        `,
        )}
      </ol>
    `;
  };

  return html`
    <div
      class=${getMeterGroupClass(state)}
      orientation=${state.orientation}
      nui-type=${state.nuiType || nothing}
    >
      ${state.labelPosition === 'start' ? renderLabels() : nothing}
      ${renderMeters()}
      ${state.labelPosition === 'end' ? renderLabels() : nothing}
    </div>
  `;
}
