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
  showButtons: 'show-buttons',
  buttonLayout: 'button-layout',
  useGrouping: 'use-grouping',
  minFractionDigits: 'min-fraction-digits',
  maxFractionDigits: 'max-fraction-digits',
  allowEmpty: 'allow-empty',
  inputId: 'input-id',
  ariaLabel: 'aria-label',
  ariaLabelledby: 'aria-labelledby',
  nuiType: 'nui-type',
  inputClass: 'input-class',
  incrementIcon: 'increment-icon',
  decrementIcon: 'decrement-icon',
};

export const NUI_INPUT_NUMBER_DEFAULTS: PlaygroundProps = {
  value: '42',
  min: '0',
  max: '100',
  step: '1',
  format: true,
  showButtons: true,
  buttonLayout: 'stacked',
  mode: 'decimal',
  locale: '',
  currency: 'USD',
  useGrouping: true,
  minFractionDigits: '',
  maxFractionDigits: '',
  prefix: '',
  suffix: '',
  placeholder: '',
  disabled: false,
  readonly: false,
  invalid: false,
  required: false,
  allowEmpty: true,
  size: '',
  variant: '',
  fluid: false,
  unstyled: false,
  nuiType: '',
  inputClass: '',
  name: '',
  inputId: '',
  ariaLabel: '',
  ariaLabelledby: '',
  incrementIcon: 'mdi:chevron-up',
  decrementIcon: 'mdi:chevron-down',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: '42',
  },
  {
    key: 'placeholder',
    label: 'placeholder',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'prefix',
    label: 'prefix',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'suffix',
    label: 'suffix',
    type: 'text',
    section: 'Content',
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
  {
    key: 'buttonLayout',
    label: 'button-layout',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'stacked', label: 'stacked' },
      { value: 'horizontal', label: 'horizontal' },
      { value: 'vertical', label: 'vertical' },
    ],
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'mode',
    label: 'mode',
    type: 'select',
    section: 'Modifiers',
    options: [
      { value: 'decimal', label: 'decimal' },
      { value: 'currency', label: 'currency' },
    ],
  },
  { key: 'format', label: 'format', type: 'boolean', section: 'Modifiers' },
  {
    key: 'showButtons',
    label: 'show-buttons',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'useGrouping',
    label: 'use-grouping',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'allowEmpty',
    label: 'allow-empty',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  { key: 'fluid', label: 'fluid', type: 'boolean', section: 'Layout' },
  {
    key: 'min',
    label: 'min',
    type: 'text',
    section: 'Layout',
    placeholder: '0',
  },
  {
    key: 'max',
    label: 'max',
    type: 'text',
    section: 'Layout',
    placeholder: '100',
  },
  {
    key: 'step',
    label: 'step',
    type: 'text',
    section: 'Layout',
    placeholder: '1',
  },
  {
    key: 'locale',
    label: 'locale',
    type: 'text',
    section: 'Layout',
    placeholder: 'en-US',
  },
  {
    key: 'currency',
    label: 'currency',
    type: 'text',
    section: 'Layout',
    placeholder: 'USD',
  },
  {
    key: 'minFractionDigits',
    label: 'min-fraction-digits',
    type: 'text',
    section: 'Layout',
  },
  {
    key: 'maxFractionDigits',
    label: 'max-fraction-digits',
    type: 'text',
    section: 'Layout',
  },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  { key: 'readonly', label: 'readonly', type: 'boolean', section: 'State' },
  { key: 'invalid', label: 'invalid', type: 'boolean', section: 'State' },
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
  {
    key: 'incrementIcon',
    label: 'increment-icon',
    type: 'text',
    section: 'HTML',
  },
  {
    key: 'decrementIcon',
    label: 'decrement-icon',
    type: 'text',
    section: 'HTML',
  },
];

function parseOptionalNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function parseOptionalFractionDigits(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function handleInputNumberChange(
  event: Event,
  handlers?: PlaygroundPreviewHandlers,
): void {
  if (!handlers) {
    return;
  }

  const value = (event as CustomEvent<{ value: number | null }>).detail.value;
  handlers.onPropChange('value', value === null ? '' : String(value));
}

function renderPreview(
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  const value = parseOptionalNumber(props.value);

  return html`
    <nui-input-number
      .value=${value}
      .min=${parseOptionalNumber(props.min)}
      .max=${parseOptionalNumber(props.max)}
      .step=${Number(props.step) > 0 ? Number(props.step) : 1}
      .format=${Boolean(props.format)}
      .showButtons=${Boolean(props.showButtons)}
      .useGrouping=${Boolean(props.useGrouping)}
      .allowEmpty=${Boolean(props.allowEmpty)}
      .minFractionDigits=${parseOptionalFractionDigits(props.minFractionDigits)}
      .maxFractionDigits=${parseOptionalFractionDigits(props.maxFractionDigits)}
      mode=${whenString(props.mode)}
      locale=${whenString(props.locale)}
      currency=${whenString(props.currency)}
      placeholder=${whenString(props.placeholder)}
      prefix=${whenString(props.prefix)}
      suffix=${whenString(props.suffix)}
      name=${whenString(props.name)}
      input-id=${whenString(props.inputId)}
      aria-label=${whenString(props.ariaLabel)}
      aria-labelledby=${whenString(props.ariaLabelledby)}
      input-class=${whenString(props.inputClass)}
      nui-type=${whenString(props.nuiType)}
      button-layout=${whenString(props.buttonLayout)}
      increment-icon=${whenString(props.incrementIcon)}
      decrement-icon=${whenString(props.decrementIcon)}
      ?disabled=${whenBoolean(props.disabled)}
      ?readonly=${whenBoolean(props.readonly)}
      ?invalid=${whenBoolean(props.invalid)}
      ?required=${whenBoolean(props.required)}
      ?fluid=${whenBoolean(props.fluid)}
      ?unstyled=${whenBoolean(props.unstyled)}
      size=${whenString(props.size)}
      variant=${whenString(props.variant)}
      @input=${(event: Event) => handleInputNumberChange(event, handlers)}
    ></nui-input-number>
  `;
}

export const nuiInputNumberPlayground: PlaygroundDefinition = {
  tag: 'nui-input-number',
  label: 'Input number',
  description:
    'Numeric input with formatting, min/max, step, and optional increment buttons.',
  defaults: NUI_INPUT_NUMBER_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-input-number',
      props,
      NUI_INPUT_NUMBER_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
