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

export const NUI_SPEED_DIAL_DEFAULTS: PlaygroundProps = {
  item1Icon: 'mdi:account',
  item2Icon: 'mdi:sync',
  item3Icon: 'mdi:delete',
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

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'item1Icon',
    label: 'item 1 icon',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'item2Icon',
    label: 'item 2 icon',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'item3Icon',
    label: 'item 3 icon',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'direction',
    label: 'direction',
    type: 'select',
    section: 'Layout',
    options: [
      { value: 'up', label: 'up' },
      { value: 'down', label: 'down' },
      { value: 'left', label: 'left' },
      { value: 'right', label: 'right' },
      { value: 'up-left', label: 'up-left' },
      { value: 'up-right', label: 'up-right' },
      { value: 'down-left', label: 'down-left' },
      { value: 'down-right', label: 'down-right' },
    ],
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
  { key: 'showIcon', label: 'show-icon', type: 'text', section: 'Content' },
  { key: 'hideIcon', label: 'hide-icon', type: 'text', section: 'Content' },
  {
    key: 'ariaLabel',
    label: 'aria-label',
    type: 'text',
    section: 'Content',
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

  const visible = (event as CustomEvent<{ visible: boolean }>).detail.visible;
  handlers.onPropChange('visible', visible);
}

function renderPreview(
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  const items: SpeedDialMenuItem[] = [
    { label: 'Add', icon: String(props.item1Icon || 'mdi:plus') },
    { label: 'Update', icon: String(props.item2Icon || 'mdi:sync') },
    { label: 'Delete', icon: String(props.item3Icon || 'mdi:delete') },
  ];

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
  getPreviewClass: () => 'speed-dial-preview-host',
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-speed-dial',
      props,
      NUI_SPEED_DIAL_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
