import type { ChartData, ChartOptions, Plugin } from 'chart.js';
import type { NuiType } from '../../types/nui-type.js';

export type ChartType =
  | 'bar'
  | 'bubble'
  | 'doughnut'
  | 'line'
  | 'pie'
  | 'polarArea'
  | 'radar'
  | 'scatter';

export interface ChartProps {
  type?: ChartType;
  data?: ChartData | null;
  options?: ChartOptions;
  plugins?: Plugin[];
  width?: string | number;
  height?: string | number;
  chartClass?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
}

export interface ChartSelectDetail {
  originalEvent: Event;
  element: unknown;
  dataset: unknown;
}
