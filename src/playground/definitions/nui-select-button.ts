import { html, type TemplateResult } from 'lit';
import type { SelectButtonOption } from '../../components/nui-select-button/types.js';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundPreviewHandlers,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const DEFAULT_OPTIONS: SelectButtonOption[] = [
  { label: 'Off', value: 'off', icon: 'mdi:cancel' },
  { label: 'On', value: 'on', icon: 'mdi:check' },
];

const ATTRIBUTE_NAMES: Record<string, string> = {
  optionLabel: 'option-label',
  optionValue: 'option-value',
  optionDisabled: 'option-disabled',
  optionIcon: 'option-icon',
  allowEmpty: 'allow-empty',
  dataKey: 'data-key',
  ariaLabelledby: 'aria-labelledby',
  nuiType: 'nui-type',
  selectButtonClass: 'select-button-class',
};

export const NUI_SELECT_BUTTON_DEFAULTS: PlaygroundProps = {
  value: 'off',
  options: JSON.stringify(DEFAULT_OPTIONS, null, 2),
  optionLabel: 'label',
  optionValue: 'value',
  optionDisabled: 'disabled',
  optionIcon: 'icon',
  multiple: false,
  allowEmpty: true,
  disabled: false,
  invalid: false,
  fluid: false,
  size: '',
  dataKey: '',
  ariaLabelledby: '',
  unstyled: false,
  nuiType: '',
  selectButtonClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: 'off',
  },
  {
    key: 'options',
    label: 'options (JSON)',
    type: 'textarea',
    section: 'Content',
    rows: 6,
    fullWidth: true,
    placeholder: '[{"label":"Off","value":"off"}]',
  },
  {
    key: 'optionLabel',
    label: 'option-label',
    type: 'text',
    section: 'Content',
    placeholder: 'label',
  },
  {
    key: 'optionValue',
    label: 'option-value',
    type: 'text',
    section: 'Content',
    placeholder: 'value',
  },
  {
    key: 'optionDisabled',
    label: 'option-disabled',
    type: 'text',
    section: 'Content',
    placeholder: 'disabled',
  },
  {
    key: 'optionIcon',
    label: 'option-icon',
    type: 'text',
    section: 'Content',
    placeholder: 'icon',
  },
  {
    key: 'selectButtonClass',
    label: 'select-button-class',
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
  { key: 'fluid', label: 'fluid', type: 'boolean', section: 'Layout' },
  { key: 'multiple', label: 'multiple', type: 'boolean', section: 'State' },
  {
    key: 'allowEmpty',
    label: 'allow-empty',
    type: 'boolean',
    section: 'State',
  },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  { key: 'invalid', label: 'invalid', type: 'boolean', section: 'State' },
  {
    key: 'dataKey',
    label: 'data-key',
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

function parseOptions(value: unknown): SelectButtonOption[] {
  if (typeof value !== 'string' || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    return Array.isArray(parsed) ? (parsed as SelectButtonOption[]) : [];
  } catch {
    return [];
  }
}

function parsePlaygroundValue(
  value: unknown,
  multiple: boolean,
): string | number | (string | number)[] | null {
  if (multiple) {
    if (typeof value !== 'string' || !value.trim()) {
      return [];
    }

    try {
      const parsed = JSON.parse(value) as unknown;

      return Array.isArray(parsed) ? (parsed as (string | number)[]) : [];
    } catch {
      return [];
    }
  }

  if (value === undefined || value === null || value === '') {
    return null;
  }

  const asNumber = Number(value);

  return Number.isFinite(asNumber) && String(asNumber) === String(value)
    ? asNumber
    : String(value);
}

function handleSelectButtonChange(
  event: Event,
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): void {
  if (!handlers) {
    return;
  }

  const value = (event as CustomEvent<{ value: unknown }>).detail.value;

  handlers.onPropChange(
    'value',
    props.multiple ? JSON.stringify(value) : String(value ?? ''),
  );
}

function renderPreview(
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  const multiple = Boolean(props.multiple);

  return html`
    <nui-select-button
      .options=${parseOptions(props.options)}
      .value=${parsePlaygroundValue(props.value, multiple)}
      option-label=${whenString(props.optionLabel)}
      option-value=${whenString(props.optionValue)}
      option-disabled=${whenString(props.optionDisabled)}
      option-icon=${whenString(props.optionIcon)}
      select-button-class=${whenString(props.selectButtonClass)}
      data-key=${whenString(props.dataKey)}
      nui-type=${whenString(props.nuiType)}
      aria-labelledby=${whenString(props.ariaLabelledby)}
      size=${whenString(props.size)}
      .allowEmpty=${Boolean(props.allowEmpty)}
      ?multiple=${whenBoolean(props.multiple)}
      ?disabled=${whenBoolean(props.disabled)}
      ?invalid=${whenBoolean(props.invalid)}
      ?fluid=${whenBoolean(props.fluid)}
      ?unstyled=${whenBoolean(props.unstyled)}
      @change=${(event: Event) =>
        handleSelectButtonChange(event, props, handlers)}
    ></nui-select-button>
  `;
}

export const nuiSelectButtonPlayground: PlaygroundDefinition = {
  tag: 'nui-select-button',
  label: 'Select Button',
  description:
    'Toggle button group for choosing one or more values from a list of options.',
  defaults: NUI_SELECT_BUTTON_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  getPreviewClass: (props) => (props.fluid ? 'is-fluid' : ''),
  formatUsage: (props) => {
    const { options: _options, value: _value, ...usageProps } = props;

    return formatUsageFromDefaults(
      'nui-select-button',
      usageProps,
      NUI_SELECT_BUTTON_DEFAULTS,
      ATTRIBUTE_NAMES,
    );
  },
};
