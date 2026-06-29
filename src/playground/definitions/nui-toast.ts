import { html, type TemplateResult } from 'lit';
import type {
  PlaygroundControl,
  PlaygroundDefinition,
  PlaygroundPreviewHandlers,
  PlaygroundProps,
} from '../types.js';
import { formatUsageFromDefaults, whenBoolean, whenString } from '../types.js';

export const NUI_TOAST_DEFAULTS: PlaygroundProps = {
  position: 'top-right',
  unstyled: false,
  nuiType: '',
};

export const ATTRIBUTE_NAMES: string[] = ['position', 'unstyled', 'nui-type'];

export const CONTROLS: PlaygroundControl[] = [
  {
    key: 'position',
    label: 'position',
    type: 'select',
    options: [
      { value: 'top-right', label: 'top-right' },
      { value: 'top-left', label: 'top-left' },
      { value: 'bottom-right', label: 'bottom-right' },
      { value: 'bottom-left', label: 'bottom-left' },
      { value: 'top-center', label: 'top-center' },
      { value: 'bottom-center', label: 'bottom-center' },
    ],
    section: 'Layout',
  },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'nuiType',
    label: 'nui-type',
    type: 'text',
    section: 'Modifiers',
  },
];

function renderPreview(
  props: PlaygroundProps,
  _handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  const triggerToast = (severity: 'success' | 'info' | 'warn' | 'error') => {
    window.dispatchEvent(
      new CustomEvent('nui-toast-add', {
        detail: {
          severity,
          summary: `${severity.charAt(0).toUpperCase() + severity.slice(1)} Message`,
          detail: `This is a sample ${severity} notification content.`,
          life: 3000,
        },
      }),
    );
  };

  return html`
    <div style="max-width: 800px; width: 100%; margin: 0 auto; padding: var(--spacing-md); display: flex; flex-direction: column; align-items: center; gap: var(--spacing-md);">
      <nui-toast
        style="--nui-toast-top: 80px;"
        position=${props.position || 'top-right'}
        ?unstyled=${whenBoolean(props.unstyled)}
        nui-type=${whenString(props.nuiType)}
      ></nui-toast>

      <div style="display: flex; gap: var(--spacing-sm); justify-content: center; flex-wrap: wrap;">
        <button
          type="button"
          style="background: var(--nui-success-color); color: white; border: 0; padding: var(--spacing-xs) var(--spacing-sm); border-radius: var(--border-radius-sm); cursor: pointer; font-weight: bold;"
          @click=${() => triggerToast('success')}
        >
          Success Toast
        </button>
        <button
          type="button"
          style="background: var(--nui-info-color); color: white; border: 0; padding: var(--spacing-xs) var(--spacing-sm); border-radius: var(--border-radius-sm); cursor: pointer; font-weight: bold;"
          @click=${() => triggerToast('info')}
        >
          Info Toast
        </button>
        <button
          type="button"
          style="background: var(--nui-warn-color); color: white; border: 0; padding: var(--spacing-xs) var(--spacing-sm); border-radius: var(--border-radius-sm); cursor: pointer; font-weight: bold;"
          @click=${() => triggerToast('warn')}
        >
          Warning Toast
        </button>
        <button
          type="button"
          style="background: var(--nui-danger-color); color: white; border: 0; padding: var(--spacing-xs) var(--spacing-sm); border-radius: var(--border-radius-sm); cursor: pointer; font-weight: bold;"
          @click=${() => triggerToast('error')}
        >
          Error Toast
        </button>
      </div>
    </div>
  `;
}

export const nuiToastPlayground: PlaygroundDefinition = {
  tag: 'nui-toast',
  label: 'Toast',
  description: 'A global overlay notification component.',
  defaults: NUI_TOAST_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-toast',
      props,
      NUI_TOAST_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
