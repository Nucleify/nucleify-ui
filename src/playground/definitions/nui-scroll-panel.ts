import { html, type TemplateResult } from 'lit';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const ATTRIBUTE_NAMES: Record<string, string> = {
  scrollPanelClass: 'scroll-panel-class',
  nuiType: 'nui-type',
};

export const NUI_SCROLL_PANEL_DEFAULTS: PlaygroundProps = {
  unstyled: false,
  scrollPanelClass: '',
  nuiType: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'scrollPanelClass',
    label: 'scroll-panel-class',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'nuiType',
    label: 'nui-type',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <div style="width: 300px; height: 180px; padding: var(--spacing-sm); background: var(--nui-bg-dark-color); border: var(--border-width) solid var(--nui-card-border); border-radius: var(--border-radius-md); box-sizing: border-box;">
      <nui-scroll-panel
        ?unstyled=${whenBoolean(props.unstyled)}
        scroll-panel-class=${whenString(props.scrollPanelClass)}
        nui-type=${whenString(props.nuiType)}
      >
        <div style="padding-right: var(--spacing-sm);">
          <p style="margin: 0 0 var(--spacing-sm) 0; font-size: 0.9rem; color: var(--nui-white-text-color); line-height: 1.5; font-weight: 500;">
            Custom Scrollbar System
          </p>
          <p style="margin: 0 0 var(--spacing-sm) 0; font-size: 0.8rem; color: var(--nui-secondary-text-color); line-height: 1.5;">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p style="margin: 0 0 var(--spacing-sm) 0; font-size: 0.8rem; color: var(--nui-secondary-text-color); line-height: 1.5;">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p style="margin: 0; font-size: 0.8rem; color: var(--nui-secondary-text-color); line-height: 1.5;">
            Sedd ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
        </div>
      </nui-scroll-panel>
    </div>
  `;
}

export const nuiScrollPanelPlayground: PlaygroundDefinition = {
  tag: 'nui-scroll-panel',
  label: 'Scroll Panel',
  description:
    'Custom scrollbar container for smooth desktop and mobile viewport scrolling experience.',
  defaults: NUI_SCROLL_PANEL_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-scroll-panel',
      props,
      NUI_SCROLL_PANEL_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
