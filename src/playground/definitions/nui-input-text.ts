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
  inputId: 'input-id',
  ariaLabel: 'aria-label',
  ariaLabelledby: 'aria-labelledby',
  nuiType: 'nui-type',
  inputClass: 'input-class',
};

export const NUI_INPUT_TEXT_DEFAULTS: PlaygroundProps = {
  value: '',
  type: 'text',
  placeholder: 'Enter text',
  disabled: false,
  readonly: false,
  invalid: false,
  required: false,
  name: '',
  inputId: '',
  ariaLabel: '',
  ariaLabelledby: '',
  autocomplete: '',
  maxlength: '',
  minlength: '',
  size: '',
  variant: '',
  fluid: false,
  unstyled: false,
  nuiType: '',
  inputClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: 'Hello',
  },
  {
    key: 'placeholder',
    label: 'placeholder',
    type: 'text',
    section: 'Content',
    placeholder: 'Enter text',
  },
  {
    key: 'name',
    label: 'name',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'inputClass',
    label: 'input-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'type',
    label: 'type',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'text', label: 'text' },
      { value: 'password', label: 'password' },
      { value: 'email', label: 'email' },
      { value: 'search', label: 'search' },
      { value: 'tel', label: 'tel' },
      { value: 'url', label: 'url' },
      { value: 'number', label: 'number' },
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
    ],
  },
  {
    key: 'variant',
    label: 'variant',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: '(default)' },
      { value: 'outlined', label: 'outlined' },
      { value: 'filled', label: 'filled' },
    ],
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'autocomplete',
    label: 'autocomplete',
    type: 'text',
    section: 'Modifiers',
    placeholder: 'off',
  },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  { key: 'fluid', label: 'fluid', type: 'boolean', section: 'Layout' },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  { key: 'readonly', label: 'readonly', type: 'boolean', section: 'State' },
  { key: 'invalid', label: 'invalid', type: 'boolean', section: 'State' },
  { key: 'required', label: 'required', type: 'boolean', section: 'State' },
  {
    key: 'maxlength',
    label: 'maxlength',
    type: 'text',
    section: 'HTML',
    placeholder: '0',
  },
  {
    key: 'minlength',
    label: 'minlength',
    type: 'text',
    section: 'HTML',
    placeholder: '0',
  },
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
    <nui-input-text
      value=${whenString(props.value)}
      type=${whenString(props.type)}
      placeholder=${whenString(props.placeholder)}
      name=${whenString(props.name)}
      input-id=${whenString(props.inputId)}
      aria-label=${whenString(props.ariaLabel)}
      aria-labelledby=${whenString(props.ariaLabelledby)}
      autocomplete=${whenString(props.autocomplete)}
      maxlength=${Number(props.maxlength) > 0 ? Number(props.maxlength) : nothing}
      minlength=${Number(props.minlength) > 0 ? Number(props.minlength) : nothing}
      size=${whenString(props.size)}
      variant=${whenString(props.variant)}
      input-class=${whenString(props.inputClass)}
      nui-type=${whenString(props.nuiType)}
      ?disabled=${whenBoolean(props.disabled)}
      ?readonly=${whenBoolean(props.readonly)}
      ?invalid=${whenBoolean(props.invalid)}
      ?required=${whenBoolean(props.required)}
      ?fluid=${whenBoolean(props.fluid)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-input-text>
  `;
}

export const nuiInputTextPlayground: PlaygroundDefinition = {
  tag: 'nui-input-text',
  label: 'Input text',
  description:
    'Single-line text input with size, variant, and validation state.',
  defaults: NUI_INPUT_TEXT_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-input-text',
      props,
      NUI_INPUT_TEXT_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
