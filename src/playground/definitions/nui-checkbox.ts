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
  inputId: 'input-id',
  ariaLabel: 'aria-label',
  ariaLabelledby: 'aria-labelledby',
  nuiType: 'nui-type',
  checkboxClass: 'checkbox-class',
};

export const NUI_CHECKBOX_DEFAULTS: PlaygroundProps = {
  checked: false,
  disabled: false,
  indeterminate: false,
  invalid: false,
  readonly: false,
  required: false,
  size: '',
  name: '',
  value: '',
  inputId: '',
  ariaLabel: '',
  ariaLabelledby: '',
  unstyled: false,
  nuiType: '',
  checkboxClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: 'on',
  },
  {
    key: 'name',
    label: 'name',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'checkboxClass',
    label: 'checkbox-class',
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
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  { key: 'checked', label: 'checked', type: 'boolean', section: 'State' },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  {
    key: 'indeterminate',
    label: 'indeterminate',
    type: 'boolean',
    section: 'State',
  },
  { key: 'invalid', label: 'invalid', type: 'boolean', section: 'State' },
  { key: 'readonly', label: 'readonly', type: 'boolean', section: 'State' },
  { key: 'required', label: 'required', type: 'boolean', section: 'State' },
  {
    key: 'inputId',
    label: 'input-id',
    type: 'text',
    section: 'HTML',
  },
  {
    key: 'ariaLabel',
    label: 'aria-label',
    type: 'text',
    section: 'HTML',
  },
  {
    key: 'ariaLabelledby',
    label: 'aria-labelledby',
    type: 'text',
    section: 'HTML',
  },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <nui-checkbox
      value=${whenString(props.value)}
      name=${whenString(props.name)}
      size=${whenString(props.size)}
      input-id=${whenString(props.inputId)}
      aria-label=${whenString(props.ariaLabel)}
      aria-labelledby=${whenString(props.ariaLabelledby)}
      nui-type=${whenString(props.nuiType)}
      checkbox-class=${whenString(props.checkboxClass)}
      ?checked=${whenBoolean(props.checked)}
      ?disabled=${whenBoolean(props.disabled)}
      ?indeterminate=${whenBoolean(props.indeterminate)}
      ?invalid=${whenBoolean(props.invalid)}
      ?readonly=${whenBoolean(props.readonly)}
      ?required=${whenBoolean(props.required)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-checkbox>
  `;
}

export const nuiCheckboxPlayground: PlaygroundDefinition = {
  tag: 'nui-checkbox',
  label: 'Checkbox',
  description:
    'Checkbox with checked, indeterminate, invalid, and size options.',
  defaults: NUI_CHECKBOX_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-checkbox',
      props,
      NUI_CHECKBOX_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
