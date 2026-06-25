import { html, type TemplateResult } from 'lit';
import type { SliderValue } from '../../components/nui-slider/types.js';
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
  valueHigh: 'value-high',
  ariaLabel: 'aria-label',
  ariaLabelledby: 'aria-labelledby',
  nuiType: 'nui-type',
  sliderClass: 'slider-class',
};

export const NUI_SLIDER_DEFAULTS: PlaygroundProps = {
  value: '40',
  valueHigh: '70',
  min: '0',
  max: '100',
  step: '0',
  range: false,
  orientation: 'horizontal',
  disabled: false,
  tabindex: '0',
  ariaLabel: '',
  ariaLabelledby: '',
  unstyled: false,
  nuiType: '',
  sliderClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: '40',
  },
  {
    key: 'valueHigh',
    label: 'value-high',
    type: 'text',
    section: 'Content',
    placeholder: '70',
  },
  {
    key: 'sliderClass',
    label: 'slider-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'orientation',
    label: 'orientation',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'horizontal', label: 'horizontal' },
      { value: 'vertical', label: 'vertical' },
    ],
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  { key: 'range', label: 'range', type: 'boolean', section: 'State' },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
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
    placeholder: '0',
  },
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

function handleSliderChange(
  event: Event,
  handlers?: PlaygroundPreviewHandlers,
): void {
  if (!handlers) {
    return;
  }

  const value = (event as CustomEvent<{ value: SliderValue }>).detail.value;

  if (Array.isArray(value)) {
    handlers.onPropChange('value', String(value[0]));
    handlers.onPropChange('valueHigh', String(value[1]));
    return;
  }

  handlers.onPropChange('value', String(value));
}

function renderPreview(
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  return html`
    <nui-slider
      value=${Number(props.value)}
      value-high=${Number(props.valueHigh)}
      min=${Number(props.min)}
      max=${Number(props.max)}
      step=${Number(props.step) > 0 ? Number(props.step) : 0}
      orientation=${whenString(props.orientation)}
      tabindex=${Number(props.tabindex)}
      aria-label=${whenString(props.ariaLabel)}
      aria-labelledby=${whenString(props.ariaLabelledby)}
      slider-class=${whenString(props.sliderClass)}
      nui-type=${whenString(props.nuiType)}
      ?range=${whenBoolean(props.range)}
      ?disabled=${whenBoolean(props.disabled)}
      ?unstyled=${whenBoolean(props.unstyled)}
      @change=${(event: Event) => handleSliderChange(event, handlers)}
    ></nui-slider>
  `;
}

export const nuiSliderPlayground: PlaygroundDefinition = {
  tag: 'nui-slider',
  label: 'Slider',
  description:
    'Range input with single or dual handles, horizontal or vertical orientation.',
  defaults: NUI_SLIDER_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-slider',
      props,
      NUI_SLIDER_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
