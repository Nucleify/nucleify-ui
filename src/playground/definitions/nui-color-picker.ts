import { html, type TemplateResult } from 'lit';
import type { ColorFormat } from '../../components/nui-color-picker/types.js';
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
  defaultColor: 'default-color',
  inputId: 'input-id',
  colorPickerClass: 'color-picker-class',
  nuiType: 'nui-type',
};

export const NUI_COLOR_PICKER_DEFAULTS: PlaygroundProps = {
  value: '10b981',
  defaultColor: 'ff0000',
  format: 'hex',
  inline: false,
  disabled: false,
  invalid: false,
  name: '',
  inputId: '',
  tabindex: '0',
  unstyled: false,
  nuiType: '',
  colorPickerClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: '10b981',
  },
  {
    key: 'defaultColor',
    label: 'default-color',
    type: 'text',
    section: 'Content',
    placeholder: 'ff0000',
  },
  {
    key: 'colorPickerClass',
    label: 'color-picker-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'format',
    label: 'format',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'hex', label: 'hex' },
      { value: 'rgb', label: 'rgb' },
      { value: 'hsb', label: 'hsb' },
    ],
  },
  {
    key: 'inline',
    label: 'inline',
    type: 'boolean',
    section: 'Appearance',
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
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
    key: 'invalid',
    label: 'invalid',
    type: 'boolean',
    section: 'State',
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
    key: 'tabindex',
    label: 'tabindex',
    type: 'text',
    section: 'HTML',
    placeholder: '0',
  },
];

function serializeValue(value: unknown, format: string): string {
  if (format === 'hex') {
    return String(value ?? '');
  }

  return JSON.stringify(value ?? '');
}

function handleInput(
  event: Event,
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): void {
  if (!handlers) {
    return;
  }

  const detail = (event as CustomEvent<{ value: unknown }>).detail.value;
  handlers.onPropChange('value', serializeValue(detail, String(props.format)));
}

function renderPreview(
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  return html`
    <div class="color-picker-preview">
      <nui-color-picker
        .value=${whenString(props.value)}
        default-color=${whenString(props.defaultColor)}
        format=${whenString(props.format) as ColorFormat}
        name=${whenString(props.name)}
        input-id=${whenString(props.inputId)}
        color-picker-class=${whenString(props.colorPickerClass)}
        nui-type=${whenString(props.nuiType)}
        tabindex=${Number(props.tabindex)}
        ?inline=${whenBoolean(props.inline)}
        ?disabled=${whenBoolean(props.disabled)}
        ?invalid=${whenBoolean(props.invalid)}
        ?unstyled=${whenBoolean(props.unstyled)}
        @input=${(event: Event) => handleInput(event, props, handlers)}
      ></nui-color-picker>
    </div>
  `;
}

export const nuiColorPickerPlayground: PlaygroundDefinition = {
  tag: 'nui-color-picker',
  label: 'Color Picker',
  description:
    'Color selection with preview swatch, popup or inline panel, and hex/rgb/hsb output.',
  defaults: NUI_COLOR_PICKER_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-color-picker',
      props,
      NUI_COLOR_PICKER_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
