import { html, nothing, type TemplateResult } from 'lit';
import type { MenuItem } from '../../components/nui-menu/types.js';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundPreviewHandlers,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const DEFAULT_MODEL: MenuItem[] = [
  { label: 'Show', icon: 'mdi:eye' },
  { label: 'Edit', icon: 'mdi:pencil' },
  { separator: true },
  { label: 'Delete', icon: 'mdi:delete', disabled: true },
];

const ATTRIBUTE_NAMES: Record<string, string> = {
  menuClass: 'menu-class',
  nuiType: 'nui-type',
};

export const NUI_MENU_DEFAULTS: PlaygroundProps = {
  model: JSON.stringify(DEFAULT_MODEL, null, 2),
  popup: false,
  disabled: false,
  unstyled: false,
  nuiType: '',
  menuClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'model',
    label: 'model (JSON)',
    type: 'textarea',
    section: 'Content',
    rows: 10,
    fullWidth: true,
    placeholder: '[{"label":"Show","icon":"mdi:eye"}]',
  },
  {
    key: 'nuiType',
    label: 'nui-type',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'menuClass',
    label: 'menu-class',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'popup',
    label: 'popup',
    type: 'boolean',
    section: 'Modifiers',
  },
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
];

function parseModel(value: unknown): MenuItem[] {
  if (typeof value !== 'string' || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? (parsed as MenuItem[]) : [];
  } catch {
    return [];
  }
}

function renderPreview(
  props: PlaygroundProps,
  _handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  const model = parseModel(props.model);
  const popup = Boolean(props.popup);

  const handleToggle = (e: Event) => {
    const btn = e.currentTarget as HTMLElement;
    const menuEl = btn.nextElementSibling as HTMLElement & {
      toggle: (event: Event) => void;
    };
    if (menuEl && typeof menuEl.toggle === 'function') {
      menuEl.toggle(e);
    }
  };

  return html`
    <div style="display: flex; flex-direction: column; gap: var(--spacing-md); align-items: flex-start; min-height: 15rem; width: 100%;">
      ${
        popup
          ? html`
            <nui-button
              label="Open Menu"
              severity="primary"
              @click=${handleToggle}
            ></nui-button>
          `
          : nothing
      }
      <nui-menu
        .model=${model}
        ?popup=${popup}
        ?disabled=${whenBoolean(props.disabled)}
        ?unstyled=${whenBoolean(props.unstyled)}
        nui-type=${whenString(props.nuiType)}
        menu-class=${whenString(props.menuClass)}
      ></nui-menu>
    </div>
  `;
}

export const nuiMenuPlayground: PlaygroundDefinition = {
  tag: 'nui-menu',
  label: 'Menu',
  description:
    'Navigation or contextual popup overlay list of action links and buttons.',
  defaults: NUI_MENU_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) => {
    const { model: _model, ...usageProps } = props;

    return formatUsageFromDefaults(
      'nui-menu',
      usageProps,
      NUI_MENU_DEFAULTS,
      ATTRIBUTE_NAMES,
    );
  },
};
