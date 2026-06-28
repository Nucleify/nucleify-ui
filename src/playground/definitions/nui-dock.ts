import { html, type TemplateResult } from 'lit';
import type { DockItem } from '../../components/nui-dock/types.js';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundPreviewHandlers,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const DEFAULT_ITEMS: DockItem[] = [
  {
    label: 'Home',
    icon: 'mdi:home',
    logo: true,
  },
  {
    label: 'Search',
    icon: 'mdi:magnify',
  },
  {
    label: 'Profile',
    icon: 'mdi:account',
  },
  {
    label: 'Settings',
    icon: 'mdi:cog',
  },
];

const ATTRIBUTE_NAMES: Record<string, string> = {
  dockClass: 'dock-class',
  dockStyle: 'dock-style',
  nuiType: 'nui-type',
};

export const NUI_DOCK_DEFAULTS: PlaygroundProps = {
  position: 'bottom',
  model: JSON.stringify(DEFAULT_ITEMS, null, 2),
  unstyled: false,
  dockClass: '',
  dockStyle: '',
  nuiType: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'position',
    label: 'position',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'bottom', label: 'bottom' },
      { value: 'top', label: 'top' },
      { value: 'left', label: 'left' },
      { value: 'right', label: 'right' },
    ],
  },
  {
    key: 'model',
    label: 'model (JSON)',
    type: 'textarea',
    section: 'Content',
    rows: 10,
    fullWidth: true,
    placeholder: '[{"label":"Home","icon":"mdi:home"}]',
  },
  {
    key: 'dockClass',
    label: 'dock-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'dockStyle',
    label: 'dock-style',
    type: 'text',
    section: 'Content',
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
];

function parseModel(value: unknown): DockItem[] {
  if (typeof value !== 'string' || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? (parsed as DockItem[]) : [];
  } catch {
    return [];
  }
}

function handleItemClick(event: Event) {
  const detail = (event as CustomEvent<{ item: DockItem }>).detail;
  console.log('Dock item clicked:', detail.item);
}

function renderPreview(
  props: PlaygroundProps,
  _handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  return html`
    <div class="dock-preview">
      <nui-dock
        .model=${parseModel(props.model)}
        position=${String(props.position)}
        dock-class=${whenString(props.dockClass)}
        dock-style=${whenString(props.dockStyle)}
        nui-type=${whenString(props.nuiType)}
        ?unstyled=${whenBoolean(props.unstyled)}
        @item-click=${handleItemClick}
      ></nui-dock>
      <div class="dock-preview-info" style="padding: 2.5rem; text-align: center; font-size: 0.875rem; color: var(--nui-secondary-text-color);">
        Changing the dock position in the attributes panel will move it to the corresponding edge of the preview container.
      </div>
    </div>
  `;
}

export const nuiDockPlayground: PlaygroundDefinition = {
  tag: 'nui-dock',
  label: 'Dock',
  description:
    'Navigation menu docked at the edge of the screen or a container.',
  defaults: NUI_DOCK_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) => {
    const { model: _model, ...usageProps } = props;

    return formatUsageFromDefaults(
      'nui-dock',
      usageProps,
      NUI_DOCK_DEFAULTS,
      ATTRIBUTE_NAMES,
    );
  },
};
