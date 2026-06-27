import { html, type TemplateResult } from 'lit';
import type { AutoCompleteSuggestion } from '../../components/nui-auto-complete/types.js';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundPreviewHandlers,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const DEFAULT_SUGGESTIONS: AutoCompleteSuggestion[] = [
  { label: 'New York', value: 'NY' },
  { label: 'Rome', value: 'RM' },
  { label: 'London', value: 'LDN' },
  { label: 'Istanbul', value: 'IST' },
  { label: 'Paris', value: 'PRS' },
];

const ATTRIBUTE_NAMES: Record<string, string> = {
  optionLabel: 'option-label',
  optionValue: 'option-value',
  optionDisabled: 'option-disabled',
  dropdownMode: 'dropdown-mode',
  scrollHeight: 'scroll-height',
  minLength: 'min-length',
  forceSelection: 'force-selection',
  completeOnFocus: 'complete-on-focus',
  emptyMessage: 'empty-message',
  dropdownIcon: 'dropdown-icon',
  inputId: 'input-id',
  ariaLabel: 'aria-label',
  ariaLabelledby: 'aria-labelledby',
  nuiType: 'nui-type',
  autoCompleteClass: 'auto-complete-class',
};

export const NUI_AUTO_COMPLETE_DEFAULTS: PlaygroundProps = {
  value: '',
  suggestions: JSON.stringify(DEFAULT_SUGGESTIONS, null, 2),
  optionLabel: 'label',
  optionValue: 'value',
  optionDisabled: 'disabled',
  placeholder: 'Search city',
  disabled: false,
  invalid: false,
  readonly: false,
  fluid: false,
  dropdown: true,
  dropdownMode: 'blank',
  size: '',
  variant: '',
  scrollHeight: '14rem',
  minLength: '1',
  forceSelection: false,
  completeOnFocus: false,
  emptyMessage: 'No results found',
  dropdownIcon: 'mdi:chevron-down',
  name: '',
  inputId: 'nui-auto-complete-preview',
  ariaLabel: '',
  ariaLabelledby: '',
  unstyled: false,
  nuiType: '',
  autoCompleteClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: 'NY',
  },
  {
    key: 'suggestions',
    label: 'suggestions (JSON)',
    type: 'textarea',
    section: 'Content',
    rows: 8,
    fullWidth: true,
    placeholder: '[{"label":"New York","value":"NY"}]',
  },
  {
    key: 'placeholder',
    label: 'placeholder',
    type: 'text',
    section: 'Content',
    placeholder: 'Search city',
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
    key: 'emptyMessage',
    label: 'empty-message',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'autoCompleteClass',
    label: 'auto-complete-class',
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
  {
    key: 'dropdownIcon',
    label: 'dropdown-icon',
    type: 'text',
    section: 'Appearance',
    placeholder: 'mdi:chevron-down',
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  { key: 'fluid', label: 'fluid', type: 'boolean', section: 'Layout' },
  { key: 'dropdown', label: 'dropdown', type: 'boolean', section: 'State' },
  {
    key: 'dropdownMode',
    label: 'dropdown-mode',
    type: 'select',
    section: 'State',
    options: [
      { value: 'blank', label: 'blank' },
      { value: 'current', label: 'current' },
    ],
  },
  {
    key: 'forceSelection',
    label: 'force-selection',
    type: 'boolean',
    section: 'State',
  },
  {
    key: 'completeOnFocus',
    label: 'complete-on-focus',
    type: 'boolean',
    section: 'State',
  },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  { key: 'invalid', label: 'invalid', type: 'boolean', section: 'State' },
  { key: 'readonly', label: 'readonly', type: 'boolean', section: 'State' },
  {
    key: 'minLength',
    label: 'min-length',
    type: 'text',
    section: 'State',
    placeholder: '1',
  },
  {
    key: 'scrollHeight',
    label: 'scroll-height',
    type: 'text',
    section: 'State',
    placeholder: '14rem',
  },
  {
    key: 'inputId',
    label: 'input-id',
    type: 'text',
    section: 'HTML',
  },
  { key: 'name', label: 'name', type: 'text', section: 'HTML' },
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

function parseSuggestions(value: unknown): AutoCompleteSuggestion[] {
  if (typeof value !== 'string' || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    return Array.isArray(parsed) ? (parsed as AutoCompleteSuggestion[]) : [];
  } catch {
    return [];
  }
}

function handleAutoCompleteChange(
  event: Event,
  handlers?: PlaygroundPreviewHandlers,
): void {
  if (!handlers) {
    return;
  }

  const value = (event as CustomEvent<{ value: string }>).detail.value;

  handlers.onPropChange('value', String(value ?? ''));
}

function renderPreview(
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  return html`
    <nui-auto-complete
      .suggestions=${parseSuggestions(props.suggestions)}
      .value=${String(props.value ?? '')}
      option-label=${whenString(props.optionLabel)}
      option-value=${whenString(props.optionValue)}
      option-disabled=${whenString(props.optionDisabled)}
      placeholder=${whenString(props.placeholder)}
      dropdown-mode=${whenString(props.dropdownMode)}
      scroll-height=${whenString(props.scrollHeight)}
      empty-message=${whenString(props.emptyMessage)}
      dropdown-icon=${whenString(props.dropdownIcon)}
      input-id=${whenString(props.inputId)}
      name=${whenString(props.name)}
      aria-label=${whenString(props.ariaLabel)}
      aria-labelledby=${whenString(props.ariaLabelledby)}
      auto-complete-class=${whenString(props.autoCompleteClass)}
      nui-type=${whenString(props.nuiType)}
      min-length=${Number(props.minLength)}
      size=${whenString(props.size)}
      variant=${whenString(props.variant)}
      ?dropdown=${whenBoolean(props.dropdown)}
      ?disabled=${whenBoolean(props.disabled)}
      ?invalid=${whenBoolean(props.invalid)}
      ?readonly=${whenBoolean(props.readonly)}
      ?fluid=${whenBoolean(props.fluid)}
      ?force-selection=${whenBoolean(props.forceSelection)}
      ?complete-on-focus=${whenBoolean(props.completeOnFocus)}
      ?unstyled=${whenBoolean(props.unstyled)}
      @change=${(event: Event) => handleAutoCompleteChange(event, handlers)}
    ></nui-auto-complete>
  `;
}

export const nuiAutoCompletePlayground: PlaygroundDefinition = {
  tag: 'nui-auto-complete',
  label: 'Auto Complete',
  description:
    'Input with filtered suggestions overlay, optional dropdown button, and keyboard navigation.',
  defaults: NUI_AUTO_COMPLETE_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  getPreviewClass: (props) => (props.fluid ? 'is-fluid' : ''),
  formatUsage: (props) => {
    const { suggestions: _suggestions, value: _value, ...usageProps } = props;

    return formatUsageFromDefaults(
      'nui-auto-complete',
      usageProps,
      NUI_AUTO_COMPLETE_DEFAULTS,
      ATTRIBUTE_NAMES,
    );
  },
};
