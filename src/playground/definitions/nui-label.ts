import { html, type TemplateResult } from 'lit';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const PREVIEW_INPUT_ID = 'nui-label-preview-input';

const ATTRIBUTE_NAMES: Record<string, string> = {
  htmlFor: 'for',
  nuiType: 'nui-type',
  labelClass: 'label-class',
};

export const NUI_LABEL_DEFAULTS: PlaygroundProps = {
  value: 'Username',
  htmlFor: PREVIEW_INPUT_ID,
  required: false,
  invalid: false,
  disabled: false,
  size: '',
  unstyled: false,
  nuiType: '',
  labelClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: 'Username',
  },
  {
    key: 'htmlFor',
    label: 'for',
    type: 'text',
    section: 'Content',
    placeholder: PREVIEW_INPUT_ID,
  },
  {
    key: 'labelClass',
    label: 'label-class',
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
    key: 'required',
    label: 'required',
    type: 'boolean',
    section: 'State',
  },
  { key: 'invalid', label: 'invalid', type: 'boolean', section: 'State' },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  const inputId = String(props.htmlFor || PREVIEW_INPUT_ID);

  return html`
    <div class="nui-label-preview">
      <nui-label
        value=${String(props.value)}
        for=${whenString(inputId)}
        label-class=${whenString(props.labelClass)}
        nui-type=${whenString(props.nuiType)}
        size=${whenString(props.size)}
        ?required=${whenBoolean(props.required)}
        ?invalid=${whenBoolean(props.invalid)}
        ?disabled=${whenBoolean(props.disabled)}
        ?unstyled=${whenBoolean(props.unstyled)}
      ></nui-label>
      <nui-input-text
        input-id=${inputId}
        ?disabled=${whenBoolean(props.disabled)}
        ?invalid=${whenBoolean(props.invalid)}
        ?required=${whenBoolean(props.required)}
      ></nui-input-text>
    </div>
  `;
}

export const nuiLabelPlayground: PlaygroundDefinition = {
  tag: 'nui-label',
  label: 'Label',
  description:
    'Form label with optional required marker, linked to a control via for.',
  defaults: NUI_LABEL_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  getPreviewClass: () => 'is-fluid',
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-label',
      props,
      NUI_LABEL_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
