import type { ChartData, ChartOptions } from 'chart.js';
import { html, type TemplateResult } from 'lit';
import type { ChartType } from '../../components/nui-chart/types.js';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const DEFAULT_DATA: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [12, 19, 8, 15, 22, 30],
      backgroundColor: 'rgba(16, 185, 129, 0.6)',
      borderColor: '#34d999',
      borderWidth: 1,
    },
  ],
};

const DEFAULT_OPTIONS: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const ATTRIBUTE_NAMES: Record<string, string> = {
  chartClass: 'chart-class',
  nuiType: 'nui-type',
};

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

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <div class="chart-preview">
      <nui-chart
        type=${whenString(props.type) as ChartType}
        .data=${parseJson<ChartData | null>(props.data, null)}
        .options=${parseJson<ChartOptions>(props.options, DEFAULT_OPTIONS)}
        width=${whenString(props.width)}
        height=${whenString(props.height)}
        chart-class=${whenString(props.chartClass)}
        nui-type=${whenString(props.nuiType)}
        ?unstyled=${whenBoolean(props.unstyled)}
      ></nui-chart>
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
