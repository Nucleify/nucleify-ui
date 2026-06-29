import { html, type TemplateResult } from 'lit';
import type { MeterItem } from '../../components/nui-meter-group/types.js';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const DEFAULT_VALUE: MeterItem[] = [
  { label: 'Apps', value: 30, color: '#10b981', icon: 'mdi:application' },
  { label: 'Images', value: 15, color: '#3b82f6', icon: 'mdi:image' },
  { label: 'Videos', value: 20, color: '#f59e0b', icon: 'mdi:video' },
  { label: 'System', value: 10, color: '#ef4444', icon: 'mdi:cog' },
];

const ATTRIBUTE_NAMES: Record<string, string> = {
  labelPosition: 'label-position',
  labelOrientation: 'label-orientation',
  meterGroupClass: 'meter-group-class',
  nuiType: 'nui-type',
};

export const NUI_METER_GROUP_DEFAULTS: PlaygroundProps = {
  value: JSON.stringify(DEFAULT_VALUE, null, 2),
  min: '0',
  max: '100',
  orientation: 'horizontal',
  labelPosition: 'end',
  labelOrientation: 'horizontal',
  unstyled: false,
  nuiType: '',
  meterGroupClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value (JSON)',
    type: 'textarea',
    section: 'Content',
    rows: 10,
    fullWidth: true,
    placeholder: '[{"label":"Apps","value":30,"color":"#10b981"}]',
  },
  {
    key: 'min',
    label: 'min',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'max',
    label: 'max',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'orientation',
    label: 'orientation',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'horizontal', label: 'horizontal' },
      { value: 'vertical', label: 'vertical' },
    ],
  },
  {
    key: 'labelPosition',
    label: 'label-position',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'start', label: 'start' },
      { value: 'end', label: 'end' },
      { value: 'none', label: 'none' },
    ],
  },
  {
    key: 'labelOrientation',
    label: 'label-orientation',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'horizontal', label: 'horizontal' },
      { value: 'vertical', label: 'vertical' },
    ],
  },
  {
    key: 'nuiType',
    label: 'nui-type',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'meterGroupClass',
    label: 'meter-group-class',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
];

function parseValue(value: unknown): MeterItem[] {
  if (typeof value !== 'string' || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? (parsed as MeterItem[]) : [];
  } catch {
    return [];
  }
}

function renderPreview(props: PlaygroundProps): TemplateResult {
  const value = parseValue(props.value);
  const min = Number(props.min);
  const max = Number(props.max);

  return html`
    <div style="width: 100%; max-width: 500px; padding: var(--spacing-md); background: var(--nui-bg-dark-color); border: var(--border-width) solid var(--nui-card-border); border-radius: var(--border-radius-md); box-sizing: border-box;">
      <nui-meter-group
        .value=${value}
        min=${min}
        max=${max}
        orientation=${String(props.orientation)}
        label-position=${String(props.labelPosition)}
        label-orientation=${String(props.labelOrientation)}
        ?unstyled=${whenBoolean(props.unstyled)}
        nui-type=${whenString(props.nuiType)}
        meter-group-class=${whenString(props.meterGroupClass)}
      ></nui-meter-group>
    </div>
  `;
}

export const nuiMeterGroupPlayground: PlaygroundDefinition = {
  tag: 'nui-meter-group',
  label: 'MeterGroup',
  description:
    'Displays a group of values as multi-segmented bar progress indicators.',
  defaults: NUI_METER_GROUP_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) => {
    const { value: _value, ...usageProps } = props;

    return formatUsageFromDefaults(
      'nui-meter-group',
      usageProps,
      NUI_METER_GROUP_DEFAULTS,
      ATTRIBUTE_NAMES,
    );
  },
};
