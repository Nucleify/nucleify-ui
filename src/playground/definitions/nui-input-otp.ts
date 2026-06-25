import { html, type TemplateResult } from 'lit';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundPreviewHandlers,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const ATTRIBUTE_NAMES: Record<string, string> = {
  integerOnly: 'integer-only',
  ariaLabel: 'aria-label',
  ariaLabelledby: 'aria-labelledby',
  nuiType: 'nui-type',
  otpClass: 'otp-class',
  inputClass: 'input-class',
};

export const NUI_INPUT_OTP_DEFAULTS: PlaygroundProps = {
  value: '',
  length: '4',
  mask: false,
  integerOnly: false,
  disabled: false,
  readonly: false,
  invalid: false,
  tabindex: '0',
  size: '',
  variant: '',
  fluid: false,
  unstyled: false,
  nuiType: '',
  otpClass: '',
  inputClass: '',
  ariaLabel: 'One-time code',
  ariaLabelledby: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: '1234',
  },
  {
    key: 'otpClass',
    label: 'otp-class',
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
  { key: 'mask', label: 'mask', type: 'boolean', section: 'Modifiers' },
  {
    key: 'integerOnly',
    label: 'integer-only',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'length',
    label: 'length',
    type: 'text',
    section: 'Layout',
    placeholder: '4',
  },
  { key: 'fluid', label: 'fluid', type: 'boolean', section: 'Layout' },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  { key: 'readonly', label: 'readonly', type: 'boolean', section: 'State' },
  { key: 'invalid', label: 'invalid', type: 'boolean', section: 'State' },
  {
    key: 'tabindex',
    label: 'tabindex',
    type: 'text',
    section: 'HTML',
    placeholder: '0',
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

function handleInputOtpChange(
  event: Event,
  handlers?: PlaygroundPreviewHandlers,
): void {
  if (!handlers) {
    return;
  }

  const value = (event as CustomEvent<{ value: string }>).detail.value;
  handlers.onPropChange('value', value);
}

function renderPreview(
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  const length = Math.max(1, Number(props.length) || 4);

  return html`
    <nui-input-otp
      value=${whenString(props.value)}
      length=${length}
      otp-class=${whenString(props.otpClass)}
      input-class=${whenString(props.inputClass)}
      aria-label=${whenString(props.ariaLabel)}
      aria-labelledby=${whenString(props.ariaLabelledby)}
      nui-type=${whenString(props.nuiType)}
      tabindex=${Number(props.tabindex)}
      .mask=${Boolean(props.mask)}
      .integerOnly=${Boolean(props.integerOnly)}
      ?disabled=${whenBoolean(props.disabled)}
      ?readonly=${whenBoolean(props.readonly)}
      ?invalid=${whenBoolean(props.invalid)}
      ?fluid=${whenBoolean(props.fluid)}
      ?unstyled=${whenBoolean(props.unstyled)}
      size=${whenString(props.size)}
      variant=${whenString(props.variant)}
      @input=${(event: Event) => handleInputOtpChange(event, handlers)}
    ></nui-input-otp>
  `;
}

export const nuiInputOtpPlayground: PlaygroundDefinition = {
  tag: 'nui-input-otp',
  label: 'Input OTP',
  description:
    'One-time password input with per-digit fields, paste support, and keyboard navigation.',
  defaults: NUI_INPUT_OTP_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-input-otp',
      props,
      NUI_INPUT_OTP_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
