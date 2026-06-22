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
  tagClass: 'tag-class',
};

export const NUI_TAG_DEFAULTS: PlaygroundProps = {
  value: 'New',
  severity: '',
  rounded: false,
  icon: '',
  unstyled: false,
  nuiType: '',
  tagClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: 'New',
  },
  {
    key: 'icon',
    label: 'icon',
    type: 'text',
    section: 'Content',
    placeholder: 'mdi:check',
  },
  {
    key: 'tagClass',
    label: 'tag-class',
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
    key: 'rounded',
    label: 'rounded',
    type: 'boolean',
    section: 'Appearance',
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
    <nui-tag
      value=${String(props.value)}
      severity=${whenString(props.severity)}
      icon=${whenString(props.icon)}
      nui-type=${whenString(props.nuiType)}
      tag-class=${whenString(props.tagClass)}
      ?rounded=${whenBoolean(props.rounded)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-tag>
  `;
}

export const nuiTagPlayground: PlaygroundDefinition = {
  tag: 'nui-tag',
  label: 'Tag',
  description:
    'Tag with severity, optional icon, rounded mode, and slot support.',
  defaults: NUI_TAG_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-tag',
      props,
      NUI_TAG_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
