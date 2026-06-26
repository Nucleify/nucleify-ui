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
  strokeWidth: 'stroke-width',
  showValue: 'show-value',
  valueTemplate: 'value-template',
  valueColor: 'value-color',
  rangeColor: 'range-color',
  textColor: 'text-color',
  ariaLabel: 'aria-label',
  ariaLabelledby: 'aria-labelledby',
  nuiType: 'nui-type',
  knobClass: 'knob-class',
};

export const NUI_KNOB_DEFAULTS: PlaygroundProps = {
  value: '60',
  min: '0',
  max: '100',
  step: '1',
  size: '100',
  strokeWidth: '14',
  showValue: true,
  valueTemplate: '{value}',
  valueColor: '',
  rangeColor: '',
  textColor: '',
  readonly: false,
  disabled: false,
  tabindex: '0',
  unstyled: false,
  nuiType: '',
  knobClass: '',
  ariaLabel: '',
  ariaLabelledby: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: '60',
  },
  {
    key: 'valueTemplate',
    label: 'value-template',
    type: 'text',
    section: 'Content',
    placeholder: '{value}',
  },
  {
    key: 'knobClass',
    label: 'knob-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'valueColor',
    label: 'value-color',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'rangeColor',
    label: 'range-color',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'textColor',
    label: 'text-color',
    type: 'text',
    section: 'Appearance',
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'showValue',
    label: 'show-value',
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
    key: 'size',
    label: 'size',
    type: 'text',
    section: 'Layout',
    placeholder: '100',
  },
  {
    key: 'strokeWidth',
    label: 'stroke-width',
    type: 'text',
    section: 'Layout',
    placeholder: '14',
  },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  { key: 'readonly', label: 'readonly', type: 'boolean', section: 'State' },
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

function handleKnobChange(
  event: Event,
  handlers?: PlaygroundPreviewHandlers,
): void {
  if (!handlers) {
    return;
  }

  const value = (event as CustomEvent<{ value: number }>).detail.value;
  handlers.onPropChange('value', String(value));
}

function renderPreview(
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  return html`
    <nui-knob
      value=${Number(props.value)}
      min=${Number(props.min)}
      max=${Number(props.max)}
      step=${Number(props.step) > 0 ? Number(props.step) : 1}
      size=${Number(props.size) > 0 ? Number(props.size) : 100}
      stroke-width=${Number(props.strokeWidth) > 0 ? Number(props.strokeWidth) : 14}
      value-template=${whenString(props.valueTemplate)}
      value-color=${whenString(props.valueColor)}
      range-color=${whenString(props.rangeColor)}
      text-color=${whenString(props.textColor)}
      knob-class=${whenString(props.knobClass)}
      nui-type=${whenString(props.nuiType)}
      aria-label=${whenString(props.ariaLabel)}
      aria-labelledby=${whenString(props.ariaLabelledby)}
      tabindex=${Number(props.tabindex)}
      .showValue=${Boolean(props.showValue)}
      ?readonly=${whenBoolean(props.readonly)}
      ?disabled=${whenBoolean(props.disabled)}
      ?unstyled=${whenBoolean(props.unstyled)}
      @input=${(event: Event) => handleKnobChange(event, handlers)}
    ></nui-knob>
  `;
}

export const nuiKnobPlayground: PlaygroundDefinition = {
  tag: 'nui-knob',
  label: 'Knob',
  description:
    'Circular dial for numeric input with drag, click, and keyboard support.',
  defaults: NUI_KNOB_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-knob',
      props,
      NUI_KNOB_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
