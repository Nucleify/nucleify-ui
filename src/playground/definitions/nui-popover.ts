import { html, type TemplateResult } from 'lit';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundProps,
  whenString,
} from '../types.js';

const ATTRIBUTE_NAMES: Record<string, string> = {
  buttonText: 'button-text',
  buttonClass: 'button-class',
  buttonStyle: 'button-style',
  popoverClass: 'popover-class',
  nuiType: 'nui-type',
};

export const NUI_POPOVER_DEFAULTS: PlaygroundProps = {
  buttonText: 'Show chat dashboard',
  icon: 'mdi:chat',
  src: '',
  buttonClass: '',
  buttonStyle: '',
  popoverClass: '',
  position: 'bottom',
  nuiType: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'buttonText',
    label: 'button-text',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'icon',
    label: 'icon',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'src',
    label: 'src (image)',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'position',
    label: 'position',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'top', label: 'top' },
      { value: 'bottom', label: 'bottom' },
      { value: 'left', label: 'left' },
      { value: 'right', label: 'right' },
    ],
  },
  {
    key: 'buttonStyle',
    label: 'button-style',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'buttonClass',
    label: 'button-class',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'popoverClass',
    label: 'popover-class',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'nuiType',
    label: 'nui-type',
    type: 'text',
    section: 'Appearance',
  },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <div style="padding: var(--spacing-md); min-height: 15rem; display: flex; align-items: flex-end; justify-content: flex-end; width: 100%; box-sizing: border-box;">
      <nui-popover
        button-text=${whenString(props.buttonText)}
        icon=${whenString(props.icon)}
        src=${whenString(props.src)}
        button-class=${whenString(props.buttonClass)}
        button-style=${whenString(props.buttonStyle)}
        popover-class=${whenString(props.popoverClass)}
        position=${String(props.position)}
        nui-type=${whenString(props.nuiType)}
      >
        <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
          <nui-heading class="popover-demo-title" tag="4" unstyled>
            <span class="popover-demo-title-content">
              <nui-icon .icon=${'mdi:message-badge'}></nui-icon>
              Live Support
            </span>
          </nui-heading>
          <p style="margin: 0; font-size: 0.875rem; color: var(--nui-secondary-text-color); line-height: 1.4;">
            Welcome to the Nucleify support agent! How can we assist you today? Our team is online and ready to help.
          </p>
          <div style="height: 1px; background: var(--nui-card-border); margin: var(--spacing-2xs) 0;"></div>
          <div style="display: flex; flex-direction: column; gap: var(--spacing-2xs);">
            <button type="button" style="background: rgba(255, 255, 255, 0.05); border: 1px solid var(--nui-card-border); border-radius: var(--border-radius-sm); padding: var(--spacing-xs); color: var(--nui-white-text-color); text-align: left; cursor: pointer; font-size: 0.85rem; font-family: inherit;">
              💬 Chat with an agent
            </button>
            <button type="button" style="background: rgba(255, 255, 255, 0.05); border: 1px solid var(--nui-card-border); border-radius: var(--border-radius-sm); padding: var(--spacing-xs); color: var(--nui-white-text-color); text-align: left; cursor: pointer; font-size: 0.85rem; font-family: inherit;">
              📚 Read documentation
            </button>
          </div>
        </div>
      </nui-popover>
    </div>
  `;
}

export const nuiPopoverPlayground: PlaygroundDefinition = {
  tag: 'nui-popover',
  label: 'Popover',
  description:
    'Fixed bottom-right chat widget or panel triggered by a floating action button.',
  defaults: NUI_POPOVER_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-popover',
      props,
      NUI_POPOVER_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
