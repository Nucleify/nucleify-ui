import type { ChartData, ChartOptions } from 'chart.js';
import { html, type TemplateResult } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import type { ChartType } from '../../components/nui-chart/types.js';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const MONTH_VALUES = [12, 19, 8, 15, 22, 30];

const SEGMENT_COLORS = [
  'rgba(16, 185, 129, 0.75)',
  'rgba(52, 211, 153, 0.75)',
  'rgba(96, 165, 250, 0.75)',
  'rgba(251, 191, 36, 0.75)',
  'rgba(244, 114, 182, 0.75)',
  'rgba(167, 139, 250, 0.75)',
];

const SEGMENT_BORDERS = [
  '#34d399',
  '#6ee7b7',
  '#60a5fa',
  '#fbbf24',
  '#f472b6',
  '#a78bfa',
];

const BASE_OPTIONS: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const ATTRIBUTE_NAMES: Record<string, string> = {
  chartClass: 'chart-class',
  nuiType: 'nui-type',
};

function getSampleDataForType(type: ChartType): ChartData {
  switch (type) {
    case 'line':
      return {
        labels: MONTH_LABELS,
        datasets: [
          {
            label: 'Revenue',
            data: MONTH_VALUES,
            borderColor: '#34d399',
            backgroundColor: 'rgba(16, 185, 129, 0.18)',
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointBackgroundColor: '#34d399',
            pointBorderColor: '#020806',
            pointRadius: 4,
          },
        ],
      };

    case 'pie':
    case 'doughnut':
    case 'polarArea':
      return {
        labels: MONTH_LABELS,
        datasets: [
          {
            label: 'Revenue',
            data: MONTH_VALUES,
            backgroundColor: SEGMENT_COLORS,
            borderColor: SEGMENT_BORDERS,
            borderWidth: 1,
          },
        ],
      };

    case 'radar':
      return {
        labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
        datasets: [
          {
            label: '2024',
            data: [88, 52, 92, 64, 48],
            borderColor: '#34d399',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: '#34d399',
          },
          {
            label: '2025',
            data: [68, 86, 74, 94, 82],
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96, 165, 250, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: '#60a5fa',
          },
        ],
      };

    case 'bubble':
      return {
        labels: ['A', 'B', 'C', 'D', 'E', 'F'],
        datasets: [
          {
            label: 'Sessions',
            data: [
              { x: 12, y: 18, r: 10 },
              { x: 16, y: 12, r: 8 },
              { x: 8, y: 22, r: 12 },
              { x: 20, y: 16, r: 9 },
              { x: 14, y: 26, r: 14 },
              { x: 22, y: 10, r: 7 },
            ],
            backgroundColor: 'rgba(16, 185, 129, 0.55)',
            borderColor: '#34d399',
            borderWidth: 1,
          },
        ],
      };

    case 'scatter':
      return {
        datasets: [
          {
            label: 'Samples',
            data: [
              { x: -6, y: 4 },
              { x: -2, y: 9 },
              { x: 3, y: 6 },
              { x: 7, y: 12 },
              { x: 11, y: 8 },
              { x: 15, y: 16 },
            ],
            backgroundColor: '#34d399',
            borderColor: '#6ee7b7',
            borderWidth: 1,
            pointRadius: 5,
          },
        ],
      };

    default:
      return {
        labels: MONTH_LABELS,
        datasets: [
          {
            label: 'Revenue',
            data: MONTH_VALUES,
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: '#34d399',
            borderWidth: 1,
          },
        ],
      };
  }
}

function getSampleOptionsForType(type: ChartType): ChartOptions {
  switch (type) {
    case 'radar':
      return {
        ...BASE_OPTIONS,
        scales: {
          r: {
            beginAtZero: true,
            suggestedMax: 100,
            grid: {
              color: 'rgba(255, 255, 255, 0.08)',
            },
            angleLines: {
              color: 'rgba(255, 255, 255, 0.08)',
            },
            pointLabels: {
              color: '#a1a1aa',
            },
            ticks: {
              display: false,
              stepSize: 20,
            },
          },
        },
      };

    case 'scatter':
    case 'bubble':
      return {
        ...BASE_OPTIONS,
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.06)',
            },
            ticks: {
              color: '#a1a1aa',
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.06)',
            },
            ticks: {
              color: '#a1a1aa',
            },
          },
        },
      };

    case 'pie':
    case 'doughnut':
    case 'polarArea':
      return {
        ...BASE_OPTIONS,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#e4e4e7',
            },
          },
        },
      };

    default:
      return { ...BASE_OPTIONS };
  }
}

const DEFAULT_DATA = getSampleDataForType('bar');
const DEFAULT_OPTIONS = getSampleOptionsForType('bar');

export const NUI_CHART_DEFAULTS: PlaygroundProps = {
  type: 'bar',
  data: JSON.stringify(DEFAULT_DATA, null, 2),
  options: JSON.stringify(DEFAULT_OPTIONS, null, 2),
  width: '',
  height: '',
  chartClass: '',
  unstyled: false,
  nuiType: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'type',
    label: 'type',
    type: 'select',
    section: 'Content',
    options: [
      { value: 'bar', label: 'bar' },
      { value: 'line', label: 'line' },
      { value: 'pie', label: 'pie' },
      { value: 'doughnut', label: 'doughnut' },
      { value: 'radar', label: 'radar' },
      { value: 'polarArea', label: 'polarArea' },
      { value: 'bubble', label: 'bubble' },
      { value: 'scatter', label: 'scatter' },
    ],
  },
  {
    key: 'data',
    label: 'data (JSON)',
    type: 'textarea',
    section: 'Content',
    rows: 12,
    fullWidth: true,
    placeholder: '{"labels":[],"datasets":[]}',
  },
  {
    key: 'options',
    label: 'options (JSON)',
    type: 'textarea',
    section: 'Content',
    rows: 6,
    fullWidth: true,
    placeholder: '{"responsive":true}',
  },
  {
    key: 'chartClass',
    label: 'chart-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'width',
    label: 'width',
    type: 'text',
    section: 'Layout',
    placeholder: '300',
  },
  {
    key: 'height',
    label: 'height',
    type: 'text',
    section: 'Layout',
    placeholder: '150',
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
];

function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string' || !value.trim()) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function handlePropChange(
  key: string,
  value: string | boolean,
): Partial<PlaygroundProps> | undefined {
  if (key !== 'type' || typeof value !== 'string') {
    return;
  }

  const type = value as ChartType;

  return {
    type,
    data: JSON.stringify(getSampleDataForType(type), null, 2),
    options: JSON.stringify(getSampleOptionsForType(type), null, 2),
  };
}

function renderPreview(props: PlaygroundProps): TemplateResult {
  const type = String(props.type || 'bar') as ChartType;
  const data = parseJson<ChartData | null>(props.data, null);
  const options = parseJson<ChartOptions>(props.options, DEFAULT_OPTIONS);

  return html`
    <div class="chart-preview">
      ${keyed(
        `${type}:${props.data}`,
        html`
          <nui-chart
            .type=${type}
            .data=${data}
            .options=${options}
            width=${whenString(props.width)}
            height=${whenString(props.height)}
            chart-class=${whenString(props.chartClass)}
            nui-type=${whenString(props.nuiType)}
            ?unstyled=${whenBoolean(props.unstyled)}
          ></nui-chart>
        `,
      )}
    </div>
  `;
}

export const nuiChartPlayground: PlaygroundDefinition = {
  tag: 'nui-chart',
  label: 'Chart',
  description:
    'Chart.js wrapper with type, data, and options (PrimeVue Chart / ad-chart).',
  defaults: NUI_CHART_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  onPropChange: handlePropChange,
  getPreviewClass: () => 'is-fluid',
  formatUsage: (props) => {
    const { data: _data, options: _options, ...usageProps } = props;

    return formatUsageFromDefaults(
      'nui-chart',
      usageProps,
      NUI_CHART_DEFAULTS,
      ATTRIBUTE_NAMES,
    );
  },
};
