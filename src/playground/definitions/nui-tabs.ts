import { html, type TemplateResult } from 'lit';
import type {
  TabListInterface,
  TabPanelInterface,
} from '../../components/nui-tabs/types.js';
import type {
  PlaygroundControl,
  PlaygroundDefinition,
  PlaygroundPreviewHandlers,
  PlaygroundProps,
} from '../types.js';
import { formatUsageFromDefaults, whenBoolean, whenString } from '../types.js';

export const NUI_TABS_DEFAULTS: PlaygroundProps = {
  value: 'tab1',
  unstyled: false,
  nuiType: '',
};

export const ATTRIBUTE_NAMES: Record<string, string> = {
  nuiType: 'nui-type',
};

export const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
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

const DEMO_LISTS: TabListInterface[] = [
  { value: 'tab1', header: 'Overview' },
  { value: 'tab2', header: 'Features' },
  { value: 'tab3', header: 'Specifications' },
];

const DEMO_PANELS: TabPanelInterface[] = [
  {
    value: 'tab1',
    content:
      'Nucleify UI provides a premium collection of web components designed for maximum agility and style. Rapidly prototype and build production-ready applications with zero external framework dependencies.',
  },
  {
    value: 'tab2',
    content:
      'Features include light and dark mode styling support, automatic layout preservation under unstyled states, and clean reactive event handling with native performance.',
  },
  {
    value: 'tab3',
    content:
      'Components are built using LitElement and compiled to Web Components. They run natively in any modern browser and integrate seamlessly with Nuxt, React, Vite, and Next.js.',
  },
];

function handleTabsChange(event: Event) {
  const detail = (event as CustomEvent<{ value: string | number }>).detail;
  console.log('Tabs active value changed to:', detail.value);
}

function renderPreview(
  props: PlaygroundProps,
  _handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  return html`
    <div style="max-width: 800px; width: 100%; margin: 0 auto; padding: var(--spacing-md);">
      <nui-tabs
        .lists=${DEMO_LISTS}
        .panels=${DEMO_PANELS}
        value=${whenString(props.value)}
        ?unstyled=${whenBoolean(props.unstyled)}
        nui-type=${whenString(props.nuiType)}
        @nui-change=${handleTabsChange}
      ></nui-tabs>
    </div>
  `;
}

export const nuiTabsPlayground: PlaygroundDefinition = {
  tag: 'nui-tabs',
  label: 'Tabs',
  description: 'An interactive tabbed container component.',
  defaults: NUI_TABS_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-tabs',
      props,
      NUI_TABS_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
