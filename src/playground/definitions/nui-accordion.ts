import { html, type TemplateResult } from 'lit';
import { normalizeAccordionPlaygroundValue } from '../../components/nui-accordion/accordion-value.js';
import type { AccordionPanel } from '../../components/nui-accordion/types.js';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundPreviewHandlers,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const DEFAULT_PANELS: AccordionPanel[] = [
  {
    index: 0,
    content: 'Save time',
    answer: 'Automate repetitive tasks and focus on what matters.',
  },
  {
    index: 1,
    content: 'Move faster',
    answer: 'Ship features quicker with a consistent design system.',
  },
  {
    index: 2,
    content: 'Stay secure',
    answer: 'Built-in patterns for auth, validation, and safe defaults.',
  },
];

const ATTRIBUTE_NAMES: Record<string, string> = {
  expandIcon: 'expand-icon',
  collapseIcon: 'collapse-icon',
  selectOnFocus: 'select-on-focus',
  accordionClass: 'accordion-class',
  nuiType: 'nui-type',
};

export const NUI_ACCORDION_DEFAULTS: PlaygroundProps = {
  value: '0',
  panels: JSON.stringify(DEFAULT_PANELS, null, 2),
  multiple: false,
  lazy: false,
  expandIcon: 'mdi:chevron-right',
  collapseIcon: 'mdi:chevron-right',
  tabindex: '0',
  selectOnFocus: false,
  unstyled: false,
  nuiType: '',
  accordionClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: 'e.g. 0',
  },
  {
    key: 'panels',
    label: 'panels (JSON)',
    type: 'textarea',
    section: 'Content',
    rows: 10,
    fullWidth: true,
    placeholder: '[{"index":0,"content":"Title","answer":"Body"}]',
  },
  {
    key: 'accordionClass',
    label: 'accordion-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'expandIcon',
    label: 'expand-icon',
    type: 'text',
    section: 'Appearance',
    placeholder: 'mdi:chevron-right',
  },
  {
    key: 'collapseIcon',
    label: 'collapse-icon',
    type: 'text',
    section: 'Appearance',
    placeholder: 'mdi:chevron-right',
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  { key: 'lazy', label: 'lazy', type: 'boolean', section: 'State' },
  { key: 'multiple', label: 'multiple', type: 'boolean', section: 'State' },
  {
    key: 'selectOnFocus',
    label: 'select-on-focus',
    type: 'boolean',
    section: 'State',
  },
  {
    key: 'tabindex',
    label: 'tabindex',
    type: 'text',
    section: 'HTML',
    placeholder: '0',
  },
];

function parsePanels(value: unknown): AccordionPanel[] {
  if (typeof value !== 'string' || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    return Array.isArray(parsed) ? (parsed as AccordionPanel[]) : [];
  } catch {
    return [];
  }
}

function handleAccordionChange(
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
    <div class="accordion-preview">
      <nui-accordion
        .panels=${parsePanels(props.panels)}
        .value=${normalizeAccordionPlaygroundValue(props.value, multiple)}
        expand-icon=${whenString(props.expandIcon)}
        collapse-icon=${whenString(props.collapseIcon)}
        accordion-class=${whenString(props.accordionClass)}
        nui-type=${whenString(props.nuiType)}
        tabindex=${Number(props.tabindex)}
        ?multiple=${whenBoolean(props.multiple)}
        ?lazy=${whenBoolean(props.lazy)}
        ?select-on-focus=${whenBoolean(props.selectOnFocus)}
        ?unstyled=${whenBoolean(props.unstyled)}
        @change=${(event: Event) => handleAccordionChange(event, props, handlers)}
      ></nui-accordion>
    </div>
  `;
}

export const nuiAccordionPlayground: PlaygroundDefinition = {
  tag: 'nui-accordion',
  label: 'Accordion',
  description:
    'Expandable panels with header and content. Supports single or multiple open sections.',
  defaults: NUI_ACCORDION_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) => {
    const { panels: _panels, value: _value, ...usageProps } = props;

    return formatUsageFromDefaults(
      'nui-accordion',
      usageProps,
      NUI_ACCORDION_DEFAULTS,
      ATTRIBUTE_NAMES,
    );
  },
};
