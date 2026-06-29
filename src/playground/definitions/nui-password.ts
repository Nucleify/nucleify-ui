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
  modelValue: 'model-value',
  passwordsMatch: 'passwords-match',
  emptyPassword: 'empty-password',
  toggleMask: 'toggle-mask',
  passwordClass: 'password-class',
  nuiType: 'nui-type',
};

export const NUI_PASSWORD_DEFAULTS: PlaygroundProps = {
  modelValue: '',
  id: 'password',
  placeholder: 'Enter password',
  passwordsMatch: false,
  emptyPassword: false,
  toggleMask: true,
  feedback: true,
  disabled: false,
  nuiType: '',
  passwordClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'modelValue',
    label: 'model-value',
    type: 'text',
    section: 'Content',
    placeholder: 'Enter password',
  },
  {
    key: 'id',
    label: 'id',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'placeholder',
    label: 'placeholder',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'passwordsMatch',
    label: 'passwords-match',
    type: 'boolean',
    section: 'State',
  },
  {
    key: 'emptyPassword',
    label: 'empty-password',
    type: 'boolean',
    section: 'State',
  },
  {
    key: 'toggleMask',
    label: 'toggle-mask',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'feedback',
    label: 'feedback',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'nuiType',
    label: 'nui-type',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'passwordClass',
    label: 'password-class',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'disabled',
    label: 'disabled',
    type: 'boolean',
    section: 'State',
  },
];

function handleChange(
  event: Event,
  handlers?: PlaygroundPreviewHandlers,
): void {
  if (!handlers) {
    return;
  }
  const target = event.target as HTMLElement & { modelValue?: string };
  if (target && 'modelValue' in target) {
    handlers.onPropChange('modelValue', String(target.modelValue));
  }
}

function renderPreview(
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  return html`
    <div style="width: 100%; max-width: 320px; min-height: 12rem;">
      <nui-password
        .modelValue=${String(props.modelValue)}
        id=${String(props.id)}
        placeholder=${String(props.placeholder)}
        ?passwords-match=${whenBoolean(props.passwordsMatch)}
        ?empty-password=${whenBoolean(props.emptyPassword)}
        ?toggle-mask=${whenBoolean(props.toggleMask)}
        ?feedback=${whenBoolean(props.feedback)}
        ?disabled=${whenBoolean(props.disabled)}
        nui-type=${whenString(props.nuiType)}
        password-class=${whenString(props.passwordClass)}
        @update:modelValue=${(event: Event) => handleChange(event, handlers)}
      ></nui-password>
    </div>
  `;
}

export const nuiPasswordPlayground: PlaygroundDefinition = {
  tag: 'nui-password',
  label: 'Password',
  description:
    'Input component to enter password credentials with strength indicator check list.',
  defaults: NUI_PASSWORD_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-password',
      props,
      NUI_PASSWORD_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
