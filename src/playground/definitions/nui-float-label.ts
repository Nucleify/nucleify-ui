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

const PREVIEW_INPUT_ID = 'nui-float-label-preview-input';

const ATTRIBUTE_NAMES: Record<string, string> = {
  floatLabelClass: 'float-label-class',
  nuiType: 'nui-type',
  inputValue: 'input-value',
  labelValue: 'label-value',
};

export const NUI_FLOAT_LABEL_DEFAULTS: PlaygroundProps = {
  inputValue: '',
  labelValue: 'Email',
  variant: 'over',
  fluid: false,
  disabled: false,
  invalid: false,
  unstyled: false,
  nuiType: '',
  floatLabelClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'labelValue',
    label: 'label',
    type: 'text',
    section: 'Content',
    placeholder: 'Email',
  },
  {
    key: 'inputValue',
    label: 'input value',
    type: 'text',
    section: 'Content',
    placeholder: '',
  },
  {
    key: 'floatLabelClass',
    label: 'float-label-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'variant',
    label: 'variant',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'over', label: 'over' },
      { value: 'in', label: 'in' },
      { value: 'on', label: 'on' },
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
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  { key: 'invalid', label: 'invalid', type: 'boolean', section: 'State' },
];

function handleInputChange(
  event: Event,
  handlers?: PlaygroundPreviewHandlers,
): void {
  if (!handlers) {
    return;
  }

  const value = (event as CustomEvent<{ value: string }>).detail.value;

  handlers.onPropChange('inputValue', value);
}

function renderPreview(
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  return html`
    <nui-float-label
      variant=${whenString(props.variant)}
      float-label-class=${whenString(props.floatLabelClass)}
      nui-type=${whenString(props.nuiType)}
      ?fluid=${whenBoolean(props.fluid)}
      ?disabled=${whenBoolean(props.disabled)}
      ?invalid=${whenBoolean(props.invalid)}
      ?unstyled=${whenBoolean(props.unstyled)}
    >
      <nui-input-text
        input-id=${PREVIEW_INPUT_ID}
        .value=${String(props.inputValue ?? '')}
        placeholder=""
        ?disabled=${whenBoolean(props.disabled)}
        ?invalid=${whenBoolean(props.invalid)}
        ?fluid=${whenBoolean(props.fluid)}
        @input=${(event: Event) => handleInputChange(event, handlers)}
        @change=${(event: Event) => handleInputChange(event, handlers)}
      ></nui-input-text>
      <nui-label
        for=${PREVIEW_INPUT_ID}
        value=${whenString(props.labelValue)}
        ?disabled=${whenBoolean(props.disabled)}
        ?invalid=${whenBoolean(props.invalid)}
      ></nui-label>
    </nui-float-label>
  `;
}

export const nuiFloatLabelPlayground: PlaygroundDefinition = {
  tag: 'nui-float-label',
  label: 'Float Label',
  description:
    'Wraps an input and label so the label floats on focus or when the field has a value.',
  defaults: NUI_FLOAT_LABEL_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  getPreviewClass: (props) => (props.fluid ? 'is-fluid' : ''),
  formatUsage: (props) => {
    const {
      inputValue: _inputValue,
      labelValue: _labelValue,
      disabled: _disabled,
      invalid: _invalid,
      ...usageProps
    } = props;
    const opening = formatUsageFromDefaults(
      'nui-float-label',
      usageProps,
      NUI_FLOAT_LABEL_DEFAULTS,
      ATTRIBUTE_NAMES,
    ).replace('></nui-float-label>', '>');

    return `${opening}
  <nui-input-text input-id="${PREVIEW_INPUT_ID}"></nui-input-text>
  <nui-label for="${PREVIEW_INPUT_ID}" value="${props.labelValue}"></nui-label>
</nui-float-label>`;
  },
};
