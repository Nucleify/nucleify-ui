import { html, type TemplateResult } from 'lit';
import type { SpeedDialMenuItem } from '../../components/nui-speed-dial/types.js';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundPreviewHandlers,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const MAX_ITEMS = 8;

/** Playground-editable item shape (JSON). */
interface SpeedDialPlaygroundItem {
  icon?: string;
  tooltip?: string;
  /** Navigate to URL on click. */
  href?: string;
  /**
   * Demo action id or message:
   * - `log:message` → console.log
   * - `alert:message` → alert
   * - anything else → console.log with the raw string
   */
  command?: string;
}

const DEFAULT_ITEMS: SpeedDialPlaygroundItem[] = [
  {
    icon: 'mdi:account',
    tooltip: 'Profile',
    href: 'https://github.com/Nucleify/nucleify-ui',
  },
  {
    icon: 'mdi:sync',
    tooltip: 'Refresh',
    command: 'log:Refreshed',
  },
  {
    icon: 'mdi:delete',
    tooltip: 'Delete',
    command: 'alert:Delete clicked',
  },
];

const ATTRIBUTE_NAMES: Record<string, string> = {
  buttonClass: 'button-class',
  maskClass: 'mask-class',
  speedDialClass: 'speed-dial-class',
  showIcon: 'show-icon',
  hideIcon: 'hide-icon',
  transitionDelay: 'transition-delay',
  hideOnClickOutside: 'hide-on-click-outside',
  rotateAnimation: 'rotate-animation',
  ariaLabel: 'aria-label',
  nuiType: 'nui-type',
};

const LINEAR_DIRECTIONS = [
  { value: 'up', label: 'up' },
  { value: 'down', label: 'down' },
  { value: 'left', label: 'left' },
  { value: 'right', label: 'right' },
];

const QUARTER_DIRECTIONS = [
  { value: 'up-left', label: 'up-left' },
  { value: 'up-right', label: 'up-right' },
  { value: 'down-left', label: 'down-left' },
  { value: 'down-right', label: 'down-right' },
];

export const NUI_SPEED_DIAL_DEFAULTS: PlaygroundProps = {
  model: JSON.stringify(DEFAULT_ITEMS, null, 2),
  direction: 'up',
  type: 'linear',
  radius: '0',
  transitionDelay: '30',
  mask: false,
  disabled: false,
  visible: false,
  hideOnClickOutside: true,
  rotateAnimation: true,
  buttonClass: '',
  maskClass: '',
  speedDialClass: '',
  showIcon: '',
  hideIcon: '',
  ariaLabel: 'Actions',
  unstyled: false,
  nuiType: '',
};

function directionOptionsForType(
  type: string,
): { value: string; label: string }[] {
  if (type === 'quarter-circle') {
    return QUARTER_DIRECTIONS;
  }

  if (type === 'circle') {
    return [{ value: 'up', label: '(n/a for circle)' }];
  }

  return LINEAR_DIRECTIONS;
}

function defaultDirectionForType(type: string): string {
  if (type === 'quarter-circle') {
    return 'up-left';
  }

  return 'up';
}

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'model',
    label: 'model (JSON, max 8) — icon, tooltip, href | command',
    type: 'textarea',
    section: 'Content',
    rows: 14,
    fullWidth: true,
    placeholder: `[
  { "icon": "mdi:account", "tooltip": "Profile", "href": "https://example.com" },
  { "icon": "mdi:sync", "tooltip": "Refresh", "command": "log:Refreshed" }
]`,
  },
  { key: 'showIcon', label: 'show-icon', type: 'text', section: 'Content' },
  { key: 'hideIcon', label: 'hide-icon', type: 'text', section: 'Content' },
  {
    key: 'ariaLabel',
    label: 'aria-label',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'type',
    label: 'type',
    type: 'select',
    section: 'Layout',
    options: [
      { value: 'linear', label: 'linear' },
      { value: 'circle', label: 'circle' },
      { value: 'semi-circle', label: 'semi-circle' },
      { value: 'quarter-circle', label: 'quarter-circle' },
    ],
  },
  {
    key: 'direction',
    label: 'direction',
    type: 'select',
    section: 'Layout',
    options: LINEAR_DIRECTIONS,
  },
  {
    key: 'radius',
    label: 'radius (0 = auto)',
    type: 'text',
    section: 'Layout',
  },
  {
    key: 'transitionDelay',
    label: 'transition-delay (ms)',
    type: 'text',
    section: 'Layout',
  },
  { key: 'mask', label: 'mask', type: 'boolean', section: 'Appearance' },
  {
    key: 'buttonClass',
    label: 'button-class',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'speedDialClass',
    label: 'speed-dial-class',
    type: 'text',
    section: 'Appearance',
  },
  { key: 'visible', label: 'visible', type: 'boolean', section: 'State' },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  {
    key: 'hideOnClickOutside',
    label: 'hide-on-click-outside',
    type: 'boolean',
    section: 'State',
  },
  {
    key: 'rotateAnimation',
    label: 'rotate-animation',
    type: 'boolean',
    section: 'State',
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Modifiers' },
  { key: 'unstyled', label: 'unstyled', type: 'boolean', section: 'Modifiers' },
];

function parsePlaygroundItems(value: unknown): SpeedDialPlaygroundItem[] {
  if (typeof value !== 'string' || !value.trim()) {
    return DEFAULT_ITEMS;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      return DEFAULT_ITEMS;
    }

    return parsed
      .filter((item): item is Record<string, unknown> => {
        return (
          Boolean(item) && typeof item === 'object' && !Array.isArray(item)
        );
      })
      .slice(0, MAX_ITEMS)
      .map((item) => ({
        icon: typeof item.icon === 'string' ? item.icon : undefined,
        tooltip: typeof item.tooltip === 'string' ? item.tooltip : undefined,
        href: typeof item.href === 'string' ? item.href : undefined,
        command: typeof item.command === 'string' ? item.command : undefined,
      }));
  } catch {
    return DEFAULT_ITEMS;
  }
}

function runCommand(command: string) {
  if (command.startsWith('log:')) {
    console.log(command.slice(4));
    return;
  }

  if (command.startsWith('alert:')) {
    window.alert(command.slice(6));
    return;
  }

  console.log('Speed dial command:', command);
}

function toMenuItems(items: SpeedDialPlaygroundItem[]): SpeedDialMenuItem[] {
  return items.map((item) => {
    const href = item.href?.trim();
    const command = item.command?.trim();

    return {
      label: item.tooltip || item.icon || 'Action',
      icon: item.icon,
      command: () => {
        if (href) {
          window.open(href, '_blank', 'noopener,noreferrer');
          return;
        }

        if (command) {
          runCommand(command);
        }
      },
    };
  });
}

function handleItemClick(event: Event) {
  const detail = (event as CustomEvent<{ item: SpeedDialMenuItem }>).detail;
  console.log('Speed dial item clicked:', detail.item);
}

function handleChange(
  event: Event,
  handlers?: PlaygroundPreviewHandlers,
): void {
  if (!handlers) {
    return;
  }

  const detail = (event as CustomEvent<{ visible?: boolean }>).detail;
  if (!detail || typeof detail !== 'object' || !('visible' in detail)) {
    return;
  }

  handlers.onPropChange('visible', Boolean(detail.visible));
}

function handlePropChange(
  key: string,
  value: string | boolean,
  props: PlaygroundProps,
): Partial<Record<string, string | boolean | undefined>> | undefined {
  if (key !== 'type') {
    return undefined;
  }

  const type = String(value);
  const allowed = directionOptionsForType(type).map((option) => option.value);
  const currentDirection = String(props.direction ?? '');
  const patch: Partial<Record<string, string | boolean | undefined>> = {};

  if (!allowed.includes(currentDirection)) {
    patch.direction = defaultDirectionForType(type);
  }

  if (
    (type === 'circle' ||
      type === 'semi-circle' ||
      type === 'quarter-circle') &&
    (props.radius === '' || props.radius === '0')
  ) {
    patch.radius = '80';
  }

  return Object.keys(patch).length ? patch : undefined;
}

function renderPreview(
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  const items = toMenuItems(parsePlaygroundItems(props.model));
  const type = String(props.type || 'linear');
  const directionControl = CONTROLS.find(
    (control) => control.key === 'direction',
  );
  if (directionControl) {
    directionControl.options = directionOptionsForType(type);
  }

  return html`
    <div class="speed-dial-preview">
      <nui-speed-dial
        .model=${items}
        direction=${whenString(props.direction)}
        type=${whenString(props.type)}
        .radius=${Number(props.radius) || 0}
        .transitionDelay=${Number(props.transitionDelay) || 30}
        ?mask=${whenBoolean(props.mask)}
        ?disabled=${whenBoolean(props.disabled)}
        ?visible=${whenBoolean(props.visible)}
        ?hide-on-click-outside=${whenBoolean(props.hideOnClickOutside)}
        ?rotate-animation=${whenBoolean(props.rotateAnimation)}
        button-class=${whenString(props.buttonClass)}
        mask-class=${whenString(props.maskClass)}
        speed-dial-class=${whenString(props.speedDialClass)}
        show-icon=${whenString(props.showIcon)}
        hide-icon=${whenString(props.hideIcon)}
        aria-label=${whenString(props.ariaLabel)}
        nui-type=${whenString(props.nuiType)}
        ?unstyled=${whenBoolean(props.unstyled)}
        @item-click=${handleItemClick}
        @change=${(event: Event) => handleChange(event, handlers)}
      ></nui-speed-dial>
    </div>
  `;
}

export const nuiSpeedDialPlayground: PlaygroundDefinition = {
  tag: 'nui-speed-dial',
  label: 'Speed Dial',
  description:
    'Floating action button that reveals a set of secondary actions.',
  defaults: NUI_SPEED_DIAL_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  onPropChange: handlePropChange,
  getPreviewClass: () => 'speed-dial-preview-host',
  formatUsage: (props) => {
    const { model: _model, ...usageProps } = props;

    return formatUsageFromDefaults(
      'nui-speed-dial',
      usageProps,
      NUI_SPEED_DIAL_DEFAULTS,
      ATTRIBUTE_NAMES,
    );
  },
};
