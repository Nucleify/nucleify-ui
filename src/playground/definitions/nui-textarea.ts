import { html, nothing, type TemplateResult } from 'lit';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const ATTRIBUTE_NAMES: Record<string, string> = {
  textareaId: 'textarea-id',
  ariaLabel: 'aria-label',
  ariaLabelledby: 'aria-labelledby',
  autoResize: 'auto-resize',
  nuiType: 'nui-type',
  textareaClass: 'textarea-class',
};

export const NUI_TEXTAREA_DEFAULTS: PlaygroundProps = {
  value: '',
  placeholder: 'Enter text',
  disabled: false,
  readonly: false,
  invalid: false,
  required: false,
  name: '',
  textareaId: '',
  ariaLabel: '',
  ariaLabelledby: '',
  autocomplete: '',
  maxlength: '',
  minlength: '',
  rows: '',
  cols: '',
  autoResize: false,
  size: '',
  variant: '',
  fluid: false,
  unstyled: false,
  nuiType: '',
  textareaClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: 'Hello',
  },
  {
    key: 'placeholder',
    label: 'placeholder',
    type: 'text',
    section: 'Content',
    placeholder: 'Enter text',
  },
  {
    key: 'name',
    label: 'name',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'textareaClass',
    label: 'textarea-class',
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
      { value: '', label: '(default)' },
      { value: 'outlined', label: 'outlined' },
      { value: 'filled', label: 'filled' },
    ],
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'autocomplete',
    label: 'autocomplete',
    type: 'text',
    section: 'Modifiers',
    placeholder: 'off',
  },
  {
    key: 'autoResize',
    label: 'auto-resize',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  { key: 'fluid', label: 'fluid', type: 'boolean', section: 'Layout' },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  { key: 'readonly', label: 'readonly', type: 'boolean', section: 'State' },
  { key: 'invalid', label: 'invalid', type: 'boolean', section: 'State' },
  { key: 'required', label: 'required', type: 'boolean', section: 'State' },
  {
    key: 'rows',
    label: 'rows',
    type: 'text',
    section: 'HTML',
    placeholder: '0',
  },
  {
    key: 'cols',
    label: 'cols',
    type: 'text',
    section: 'HTML',
    placeholder: '0',
  },
  {
    key: 'maxlength',
    label: 'maxlength',
    type: 'text',
    section: 'HTML',
    placeholder: '0',
  },
  {
    key: 'minlength',
    label: 'minlength',
    type: 'text',
    section: 'HTML',
    placeholder: '0',
  },
  {
    key: 'textareaId',
    label: 'textarea-id',
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

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <nui-textarea
      value=${whenString(props.value)}
      placeholder=${whenString(props.placeholder)}
      name=${whenString(props.name)}
      textarea-id=${whenString(props.textareaId)}
      aria-label=${whenString(props.ariaLabel)}
      aria-labelledby=${whenString(props.ariaLabelledby)}
      autocomplete=${whenString(props.autocomplete)}
      maxlength=${Number(props.maxlength) > 0 ? Number(props.maxlength) : nothing}
      minlength=${Number(props.minlength) > 0 ? Number(props.minlength) : nothing}
      rows=${Number(props.rows) > 0 ? Number(props.rows) : nothing}
      cols=${Number(props.cols) > 0 ? Number(props.cols) : nothing}
      size=${whenString(props.size)}
      variant=${whenString(props.variant)}
      textarea-class=${whenString(props.textareaClass)}
      nui-type=${whenString(props.nuiType)}
      ?disabled=${whenBoolean(props.disabled)}
      ?readonly=${whenBoolean(props.readonly)}
      ?invalid=${whenBoolean(props.invalid)}
      ?required=${whenBoolean(props.required)}
      ?auto-resize=${whenBoolean(props.autoResize)}
      ?fluid=${whenBoolean(props.fluid)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-textarea>
  `;
}

export const nuiTextareaPlayground: PlaygroundDefinition = {
  tag: 'nui-textarea',
  label: 'Textarea',
  description:
    'Multi-line text input with auto-resize, size, variant, and validation state.',
  defaults: NUI_TEXTAREA_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-textarea',
      props,
      NUI_TEXTAREA_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
