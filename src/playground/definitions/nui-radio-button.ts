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
  radioButtonClass: 'radio-button-class',
};

export const NUI_RADIO_BUTTON_DEFAULTS: PlaygroundProps = {
  checked: false,
  value: 'option-a',
  name: 'demo',
  binary: false,
  disabled: false,
  invalid: false,
  readonly: false,
  size: '',
  variant: '',
  tabindex: '',
  inputId: '',
  ariaLabel: '',
  ariaLabelledby: '',
  unstyled: false,
  nuiType: '',
  radioButtonClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: 'option-a',
  },
  {
    key: 'name',
    label: 'name',
    type: 'text',
    section: 'Content',
    placeholder: 'demo',
  },
  {
    key: 'radioButtonClass',
    label: 'radio-button-class',
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
      { value: '', label: 'outlined' },
      { value: 'filled', label: 'filled' },
    ],
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  { key: 'binary', label: 'binary', type: 'boolean', section: 'State' },
  { key: 'checked', label: 'checked', type: 'boolean', section: 'State' },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  { key: 'invalid', label: 'invalid', type: 'boolean', section: 'State' },
  { key: 'readonly', label: 'readonly', type: 'boolean', section: 'State' },
  {
    key: 'tabindex',
    label: 'tabindex',
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
    <nui-radio-button
      value=${whenString(props.value)}
      name=${whenString(props.name)}
      size=${whenString(props.size)}
      variant=${whenString(props.variant)}
      input-id=${whenString(props.inputId)}
      aria-label=${whenString(props.ariaLabel)}
      aria-labelledby=${whenString(props.ariaLabelledby)}
      tabindex=${props.tabindex !== '' && props.tabindex != null ? Number(props.tabindex) : nothing}
      nui-type=${whenString(props.nuiType)}
      radio-button-class=${whenString(props.radioButtonClass)}
      ?checked=${whenBoolean(props.checked)}
      ?binary=${whenBoolean(props.binary)}
      ?disabled=${whenBoolean(props.disabled)}
      ?invalid=${whenBoolean(props.invalid)}
      ?readonly=${whenBoolean(props.readonly)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-radio-button>
  `;
}

export const nuiRadioButtonPlayground: PlaygroundDefinition = {
  tag: 'nui-radio-button',
  label: 'Radio button',
  description:
    'Single-choice radio control with size, variant, and invalid states.',
  defaults: NUI_RADIO_BUTTON_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-radio-button',
      props,
      NUI_RADIO_BUTTON_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
