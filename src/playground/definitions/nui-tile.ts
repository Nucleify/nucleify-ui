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
  countSecondary: 'count-secondary',
  textSecondary: 'text-secondary',
  tileClass: 'tile-class',
  nuiType: 'nui-type',
};

export const NUI_TILE_DEFAULTS: PlaygroundProps = {
  href: '#saved-time',
  header: 'Saved time',
  count: '12h',
  countSecondary: '3',
  textSecondary: 'since last week',
  icon: 'mdi:clock-fast',
  tileClass: '',
  unstyled: false,
  nuiType: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'header',
    label: 'header',
    type: 'text',
    section: 'Content',
    placeholder: 'Saved time',
  },
  {
    key: 'count',
    label: 'count',
    type: 'text',
    section: 'Content',
    placeholder: '12h',
  },
  {
    key: 'countSecondary',
    label: 'count-secondary',
    type: 'text',
    section: 'Content',
    placeholder: '3',
  },
  {
    key: 'textSecondary',
    label: 'text-secondary',
    type: 'text',
    section: 'Content',
    placeholder: 'since last week',
  },
  {
    key: 'icon',
    label: 'icon',
    type: 'text',
    section: 'Content',
    placeholder: 'mdi:clock-fast',
  },
  {
    key: 'href',
    label: 'href',
    type: 'text',
    section: 'Content',
    placeholder: '#saved-time',
  },
  {
    key: 'tileClass',
    label: 'tile-class',
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

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <nui-tile
      href=${whenString(props.href)}
      header=${whenString(props.header)}
      count=${whenString(props.count)}
      count-secondary=${whenString(props.countSecondary)}
      text-secondary=${whenString(props.textSecondary)}
      icon=${whenString(props.icon)}
      tile-class=${whenString(props.tileClass)}
      nui-type=${whenString(props.nuiType)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-tile>
  `;
}

export const nuiTilePlayground: PlaygroundDefinition = {
  tag: 'nui-tile',
  label: 'Tile',
  description:
    'Linked stat card with header, count, icon, and secondary summary line.',
  defaults: NUI_TILE_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-tile',
      props,
      NUI_TILE_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
