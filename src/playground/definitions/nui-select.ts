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
  selectClass: 'select-class',
  nuiType: 'nui-type',
};

export const NUI_SELECT_DEFAULTS: PlaygroundProps = {
  value: '',
  placeholder: 'Select an option',
  disabled: false,
  invalid: false,
  fluid: false,
  size: '',
  variant: '',
  selectClass: '',
  unstyled: false,
  nuiType: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'placeholder',
    label: 'placeholder',
    type: 'text',
    section: 'Content',
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
    ],
  },
  {
    key: 'variant',
    label: 'variant',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: '(default)' },
      { value: 'filled', label: 'filled' },
    ],
  },
  {
    key: 'selectClass',
    label: 'select-class',
    type: 'text',
    section: 'Appearance',
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  { key: 'fluid', label: 'fluid', type: 'boolean', section: 'Layout' },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  { key: 'invalid', label: 'invalid', type: 'boolean', section: 'State' },
  { key: 'unstyled', label: 'unstyled', type: 'boolean', section: 'Modifiers' },
];

const DEMO_OPTIONS = JSON.stringify([
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Mango', value: 'mango' },
  { label: 'Orange (disabled)', value: 'orange', disabled: true },
]);

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <div style="padding: var(--spacing-md); display: flex; gap: var(--spacing-sm); align-items: center; flex-wrap: wrap;">
      <nui-select
        placeholder=${whenString(props.placeholder)}
        .options=${JSON.parse(DEMO_OPTIONS)}
        ?disabled=${whenBoolean(props.disabled)}
        ?invalid=${whenBoolean(props.invalid)}
        ?fluid=${whenBoolean(props.fluid)}
        size=${whenString(props.size)}
        variant=${whenString(props.variant)}
        select-class=${whenString(props.selectClass)}
        nui-type=${whenString(props.nuiType)}
        ?unstyled=${whenBoolean(props.unstyled)}
      ></nui-select>
    </div>
  `;
}

export const nuiSelectPlayground: PlaygroundDefinition = {
  tag: 'nui-select',
  label: 'Select',
  description:
    'Native select dropdown styled to match the Nucleify design system.',
  defaults: NUI_SELECT_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-select',
      props,
      NUI_SELECT_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
