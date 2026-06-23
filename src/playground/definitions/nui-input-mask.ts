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
  slotChar: 'slot-char',
  autoClear: 'auto-clear',
  inputId: 'input-id',
  ariaLabel: 'aria-label',
  ariaLabelledby: 'aria-labelledby',
  nuiType: 'nui-type',
  inputClass: 'input-class',
};

export const NUI_INPUT_MASK_DEFAULTS: PlaygroundProps = {
  value: '',
  mask: '99/99/9999',
  slotChar: '_',
  autoClear: true,
  unmask: false,
  placeholder: 'mm/dd/yyyy',
  disabled: false,
  readonly: false,
  invalid: false,
  name: '',
  inputId: '',
  ariaLabel: '',
  ariaLabelledby: '',
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
    placeholder: '01/15/2026',
  },
  {
    key: 'mask',
    label: 'mask',
    type: 'text',
    section: 'Content',
    placeholder: '99/99/9999',
  },
  {
    key: 'placeholder',
    label: 'placeholder',
    type: 'text',
    section: 'Content',
    placeholder: 'mm/dd/yyyy',
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
    key: 'slotChar',
    label: 'slot-char',
    type: 'text',
    section: 'Appearance',
    placeholder: '_',
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
    key: 'autoClear',
    label: 'auto-clear',
    type: 'boolean',
    section: 'Modifiers',
  },
  { key: 'unmask', label: 'unmask', type: 'boolean', section: 'Modifiers' },
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
    <nui-input-mask
      value=${whenString(props.value)}
      mask=${whenString(props.mask)}
      slot-char=${whenString(props.slotChar)}
      placeholder=${whenString(props.placeholder)}
      name=${whenString(props.name)}
      input-id=${whenString(props.inputId)}
      aria-label=${whenString(props.ariaLabel)}
      aria-labelledby=${whenString(props.ariaLabelledby)}
      size=${whenString(props.size)}
      variant=${whenString(props.variant)}
      input-class=${whenString(props.inputClass)}
      nui-type=${whenString(props.nuiType)}
      ?auto-clear=${whenBoolean(props.autoClear)}
      ?unmask=${whenBoolean(props.unmask)}
      ?disabled=${whenBoolean(props.disabled)}
      ?readonly=${whenBoolean(props.readonly)}
      ?invalid=${whenBoolean(props.invalid)}
      ?fluid=${whenBoolean(props.fluid)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-input-mask>
  `;
}

export const nuiInputMaskPlayground: PlaygroundDefinition = {
  tag: 'nui-input-mask',
  label: 'Input mask',
  description:
    'Masked text input with PrimeVue-compatible mask tokens (9, a, *, ?).',
  defaults: NUI_INPUT_MASK_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-input-mask',
      props,
      NUI_INPUT_MASK_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
