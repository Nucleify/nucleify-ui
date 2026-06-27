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
  dateFormat: 'date-format',
  showOnFocus: 'show-on-focus',
  showIcon: 'show-icon',
  manualInput: 'manual-input',
  inputId: 'input-id',
  ariaLabel: 'aria-label',
  ariaLabelledby: 'aria-labelledby',
  datePickerClass: 'date-picker-class',
  nuiType: 'nui-type',
};

export const NUI_DATE_PICKER_DEFAULTS: PlaygroundProps = {
  value: '',
  placeholder: 'Select date',
  dateFormat: 'yy-mm-dd',
  disabled: false,
  readonly: false,
  invalid: false,
  required: false,
  fluid: false,
  size: '',
  variant: '',
  showOnFocus: true,
  showIcon: true,
  icon: 'mdi:calendar',
  manualInput: false,
  name: '',
  inputId: 'nui-date-picker-preview',
  ariaLabel: '',
  ariaLabelledby: '',
  unstyled: false,
  nuiType: '',
  datePickerClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: '2026-06-22',
  },
  {
    key: 'placeholder',
    label: 'placeholder',
    type: 'text',
    section: 'Content',
    placeholder: 'Select date',
  },
  {
    key: 'dateFormat',
    label: 'date-format',
    type: 'text',
    section: 'Content',
    placeholder: 'yy-mm-dd',
  },
  {
    key: 'datePickerClass',
    label: 'date-picker-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'icon',
    label: 'icon',
    type: 'text',
    section: 'Appearance',
    placeholder: 'mdi:calendar',
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
      { value: 'outlined', label: 'outlined' },
    ],
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'showOnFocus',
    label: 'show-on-focus',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'showIcon',
    label: 'show-icon',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'manualInput',
    label: 'manual-input',
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
    key: 'disabled',
    label: 'disabled',
    type: 'boolean',
    section: 'State',
  },
  {
    key: 'readonly',
    label: 'readonly',
    type: 'boolean',
    section: 'State',
  },
  {
    key: 'invalid',
    label: 'invalid',
    type: 'boolean',
    section: 'State',
  },
  {
    key: 'required',
    label: 'required',
    type: 'boolean',
    section: 'State',
  },
  {
    key: 'fluid',
    label: 'fluid',
    type: 'boolean',
    section: 'Layout',
  },
  {
    key: 'name',
    label: 'name',
    type: 'text',
    section: 'HTML',
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

function handleChange(
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
  return html`
    <div class="date-picker-preview">
      <nui-date-picker
        value=${whenString(props.value)}
        placeholder=${whenString(props.placeholder)}
        date-format=${whenString(props.dateFormat)}
        name=${whenString(props.name)}
        input-id=${whenString(props.inputId)}
        icon=${whenString(props.icon)}
        date-picker-class=${whenString(props.datePickerClass)}
        aria-label=${whenString(props.ariaLabel)}
        aria-labelledby=${whenString(props.ariaLabelledby)}
        nui-type=${whenString(props.nuiType)}
        size=${whenString(props.size)}
        variant=${whenString(props.variant)}
        ?disabled=${whenBoolean(props.disabled)}
        ?readonly=${whenBoolean(props.readonly)}
        ?invalid=${whenBoolean(props.invalid)}
        ?required=${whenBoolean(props.required)}
        ?fluid=${whenBoolean(props.fluid)}
        ?show-on-focus=${whenBoolean(props.showOnFocus)}
        ?show-icon=${whenBoolean(props.showIcon)}
        ?manual-input=${whenBoolean(props.manualInput)}
        ?unstyled=${whenBoolean(props.unstyled)}
        @change=${(event: Event) => handleChange(event, handlers)}
      ></nui-date-picker>
    </div>
  `;
}

export const nuiDatePickerPlayground: PlaygroundDefinition = {
  tag: 'nui-date-picker',
  label: 'Date Picker',
  description:
    'Single-date input with calendar overlay; value stored as YYYY-MM-DD.',
  defaults: NUI_DATE_PICKER_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-date-picker',
      props,
      NUI_DATE_PICKER_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
