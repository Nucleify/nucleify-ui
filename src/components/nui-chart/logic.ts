import type { ChartData, ChartOptions, Plugin } from 'chart.js';
import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { ChartType } from './types.js';

export interface NuiChartViewState {
  type: ChartType;
  data: ChartData | null;
  options: ChartOptions;
  plugins: Plugin[];
  width: string;
  height: string;
  chartClass: string;
  nuiType: NuiType;
}

export function getChartClass(chartClass: string): string {
  return ['nui-chart', chartClass].filter(Boolean).join(' ');
}

export function hasChartDimensions(
  state: Pick<NuiChartViewState, 'width' | 'height'>,
): boolean {
  return Boolean(state.width || state.height);
}

export function renderChart(state: NuiChartViewState): TemplateResult {
  if (!state.data) {
    return html``;
  }

  const sized = hasChartDimensions(state);

  return html`
    <div
      class=${getChartClass(state.chartClass)}
      nui-type=${state.nuiType || nothing}
      role="img"
      aria-label="Chart"
    >
      <div class="nui-chart-content">
        <canvas
          width=${state.width || nothing}
          height=${state.height || nothing}
          ?sized=${sized || nothing}
        ></canvas>
      </div>
    </div>
  `;
}
