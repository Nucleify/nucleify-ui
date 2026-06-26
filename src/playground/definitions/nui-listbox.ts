import { html, type TemplateResult } from 'lit';
import type { ListboxOption } from '../../components/nui-listbox/types.js';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundPreviewHandlers,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const DEFAULT_OPTIONS: ListboxOption[] = [
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
  filterPlaceholder: 'filter-placeholder',
  listScrollHeight: 'scroll-height',
  highlightOnSelect: 'highlight-on-select',
  emptyMessage: 'empty-message',
  emptyFilterMessage: 'empty-filter-message',
  ariaLabel: 'aria-label',
  ariaLabelledby: 'aria-labelledby',
  nuiType: 'nui-type',
  listboxClass: 'listbox-class',
};

export const NUI_LISTBOX_DEFAULTS: PlaygroundProps = {
  value: 'NY',
  options: JSON.stringify(DEFAULT_OPTIONS, null, 2),
  optionLabel: 'label',
  optionValue: 'value',
  optionDisabled: 'disabled',
  multiple: false,
  disabled: false,
  invalid: false,
  readonly: false,
  filter: false,
  filterPlaceholder: '',
  listScrollHeight: '14rem',
  striped: false,
  checkmark: false,
  highlightOnSelect: true,
  emptyMessage: 'No results found',
  emptyFilterMessage: 'No results found',
  fluid: false,
  tabindex: '0',
  unstyled: false,
  nuiType: '',
  listboxClass: '',
  ariaLabel: '',
  ariaLabelledby: '',
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
    key: 'options',
    label: 'options (JSON)',
    type: 'textarea',
    section: 'Content',
    rows: 8,
    fullWidth: true,
    placeholder: '[{"label":"New York","value":"NY"}]',
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
    key: 'emptyFilterMessage',
    label: 'empty-filter-message',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'listScrollHeight',
    label: 'scroll-height',
    type: 'text',
    section: 'Appearance',
    placeholder: '14rem',
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'listboxClass',
    label: 'listbox-class',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'striped',
    label: 'striped',
    type: 'boolean',
    section: 'Appearance',
  },
  {
    key: 'checkmark',
    label: 'checkmark',
    type: 'boolean',
    section: 'Appearance',
  },
  {
    key: 'highlightOnSelect',
    label: 'highlight-on-select',
    type: 'boolean',
    section: 'Appearance',
  },
  { key: 'filter', label: 'filter', type: 'boolean', section: 'Modifiers' },
  {
    key: 'filterPlaceholder',
    label: 'filter-placeholder',
    type: 'text',
    section: 'Modifiers',
    placeholder: 'Search',
  },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  { key: 'fluid', label: 'fluid', type: 'boolean', section: 'Layout' },
  {
    key: 'tabindex',
    label: 'tabindex',
    type: 'text',
    section: 'Layout',
    placeholder: '0',
  },
  { key: 'multiple', label: 'multiple', type: 'boolean', section: 'State' },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  { key: 'readonly', label: 'readonly', type: 'boolean', section: 'State' },
  { key: 'invalid', label: 'invalid', type: 'boolean', section: 'State' },
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

function parseOptions(value: unknown): ListboxOption[] {
  if (typeof value !== 'string' || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    return Array.isArray(parsed) ? (parsed as ListboxOption[]) : [];
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

function handleListboxChange(
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
    <nui-listbox
      .options=${parseOptions(props.options)}
      .value=${parsePlaygroundValue(props.value, multiple)}
      option-label=${whenString(props.optionLabel)}
      option-value=${whenString(props.optionValue)}
      option-disabled=${whenString(props.optionDisabled)}
      filter-placeholder=${whenString(props.filterPlaceholder)}
      scroll-height=${whenString(props.listScrollHeight)}
      empty-message=${whenString(props.emptyMessage)}
      empty-filter-message=${whenString(props.emptyFilterMessage)}
      listbox-class=${whenString(props.listboxClass)}
      nui-type=${whenString(props.nuiType)}
      aria-label=${whenString(props.ariaLabel)}
      aria-labelledby=${whenString(props.ariaLabelledby)}
      tabindex=${Number(props.tabindex)}
      .highlightOnSelect=${Boolean(props.highlightOnSelect)}
      ?multiple=${whenBoolean(props.multiple)}
      ?disabled=${whenBoolean(props.disabled)}
      ?readonly=${whenBoolean(props.readonly)}
      ?invalid=${whenBoolean(props.invalid)}
      ?filter=${whenBoolean(props.filter)}
      ?striped=${whenBoolean(props.striped)}
      ?checkmark=${whenBoolean(props.checkmark)}
      ?fluid=${whenBoolean(props.fluid)}
      ?unstyled=${whenBoolean(props.unstyled)}
      @change=${(event: Event) => handleListboxChange(event, props, handlers)}
    ></nui-listbox>
  `;
}

export const nuiListboxPlayground: PlaygroundDefinition = {
  tag: 'nui-listbox',
  label: 'Listbox',
  description:
    'List of selectable options with optional filter, multiple selection, and keyboard navigation.',
  defaults: NUI_LISTBOX_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  getPreviewClass: (props) => (props.fluid ? 'is-fluid' : ''),
  formatUsage: (props) => {
    const { options: _options, value: _value, ...usageProps } = props;

    return formatUsageFromDefaults(
      'nui-listbox',
      usageProps,
      NUI_LISTBOX_DEFAULTS,
      ATTRIBUTE_NAMES,
    );
  },
};
