import { html, type TemplateResult } from 'lit';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const ATTRIBUTE_NAMES: Record<string, string> = {
  nuiType: 'nui-type',
  badgeClass: 'badge-class',
};

export const NUI_BADGE_DEFAULTS: PlaygroundProps = {
  value: '5',
  severity: '',
  size: '',
  unstyled: false,
  nuiType: '',
  badgeClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: '5',
  },
  {
    key: 'badgeClass',
    label: 'badge-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'severity',
    label: 'severity',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: '(default)' },
      { value: 'secondary', label: 'secondary' },
      { value: 'success', label: 'success' },
      { value: 'info', label: 'info' },
      { value: 'warn', label: 'warn' },
      { value: 'help', label: 'help' },
      { value: 'danger', label: 'danger' },
      { value: 'contrast', label: 'contrast' },
    ],
  },
  {
    key: 'size',
    label: 'size',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: '(default)' },
      { value: 'small', label: 'small' },
      { value: 'large', label: 'large' },
      { value: 'xlarge', label: 'xlarge' },
    ],
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <nui-badge
      value=${String(props.value)}
      severity=${whenString(props.severity)}
      size=${whenString(props.size)}
      nui-type=${whenString(props.nuiType)}
      badge-class=${whenString(props.badgeClass)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-badge>
  `;
}

export const nuiBadgePlayground: PlaygroundDefinition = {
  tag: 'nui-badge',
  label: 'Badge',
  description: 'Badge with severity, size, dot mode, and slot support.',
  defaults: NUI_BADGE_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-badge',
      props,
      NUI_BADGE_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
