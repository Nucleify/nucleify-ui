import { html, nothing, type TemplateResult } from 'lit';
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
  dividerClass: 'divider-class',
};

export const NUI_DIVIDER_DEFAULTS: PlaygroundProps = {
  content: '',
  layout: '',
  align: '',
  type: '',
  unstyled: false,
  nuiType: '',
  dividerClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'content',
    label: 'content',
    type: 'text',
    section: 'Content',
    placeholder: 'OR',
  },
  {
    key: 'dividerClass',
    label: 'divider-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'layout',
    label: 'layout',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: '(default)' },
      { value: 'horizontal', label: 'horizontal' },
      { value: 'vertical', label: 'vertical' },
    ],
  },
  {
    key: 'align',
    label: 'align',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: '(default)' },
      { value: 'left', label: 'left' },
      { value: 'center', label: 'center' },
      { value: 'right', label: 'right' },
      { value: 'top', label: 'top' },
      { value: 'bottom', label: 'bottom' },
    ],
  },
  {
    key: 'type',
    label: 'type',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: '(default)' },
      { value: 'solid', label: 'solid' },
      { value: 'dashed', label: 'dashed' },
      { value: 'dotted', label: 'dotted' },
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
  const content = String(props.content ?? '');

  if (props.layout === 'vertical') {
    return html`
      <div style="display: flex; align-items: stretch; min-height: 8rem;">
        <nui-divider
          layout="vertical"
          align=${whenString(props.align)}
          type=${whenString(props.type)}
          nui-type=${whenString(props.nuiType)}
          divider-class=${whenString(props.dividerClass)}
          ?unstyled=${whenBoolean(props.unstyled)}
        >
          ${content || nothing}
        </nui-divider>
        <span style="padding: 0 1rem; color: var(--nui-secondary-text-color);"
          >Content</span
        >
      </div>
    `;
  }

  return html`
    <nui-divider
      layout=${whenString(props.layout)}
      align=${whenString(props.align)}
      type=${whenString(props.type)}
      nui-type=${whenString(props.nuiType)}
      divider-class=${whenString(props.dividerClass)}
      ?unstyled=${whenBoolean(props.unstyled)}
    >
      ${content || nothing}
    </nui-divider>
  `;
}

export const nuiDividerPlayground: PlaygroundDefinition = {
  tag: 'nui-divider',
  label: 'Divider',
  description:
    'Divider with horizontal or vertical layout, alignment, and border type.',
  defaults: NUI_DIVIDER_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-divider',
      props,
      NUI_DIVIDER_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
