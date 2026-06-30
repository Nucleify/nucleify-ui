import { html, type TemplateResult } from 'lit';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundProps,
  whenString,
  whenStringNotDefault,
} from '../types.js';

const ATTRIBUTE_NAMES: Record<string, string> = {
  nuiType: 'nui-type',
};

export const NUI_ICON_DEFAULTS: PlaygroundProps = {
  icon: 'mdi:check',
  width: '',
  height: '',
  mode: 'svg',
  nuiType: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'icon',
    label: 'icon',
    type: 'text',
    section: 'Content',
    placeholder: 'mdi:check',
  },
  {
    key: 'width',
    label: 'width',
    type: 'text',
    section: 'Layout',
    placeholder: '1em',
  },
  {
    key: 'height',
    label: 'height',
    type: 'text',
    section: 'Layout',
    placeholder: '1em',
  },
  {
    key: 'mode',
    label: 'mode',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'svg', label: 'svg' },
      { value: 'mask', label: 'mask' },
      { value: 'style', label: 'style' },
    ],
  },
  {
    key: 'nuiType',
    label: 'nui-type',
    type: 'text',
    section: 'Appearance',
  },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <nui-icon
      icon=${String(props.icon)}
      width=${whenStringNotDefault(props.width, '')}
      height=${whenStringNotDefault(props.height, '')}
      mode=${whenStringNotDefault(props.mode, 'svg')}
      nui-type=${whenString(props.nuiType)}
    ></nui-icon>
  `;
}

export const nuiIconPlayground: PlaygroundDefinition = {
  tag: 'nui-icon',
  label: 'Icon',
  description: 'Iconify-based icon with configurable size and render mode.',
  defaults: NUI_ICON_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-icon',
      props,
      NUI_ICON_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
