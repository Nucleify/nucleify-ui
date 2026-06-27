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
  anchorClass: 'anchor-class',
  itemClass: 'item-class',
  anchorStyle: 'anchor-style',
  nuiType: 'nui-type',
};

export const NUI_ANCHOR_DEFAULTS: PlaygroundProps = {
  href: '#contact',
  rel: '',
  target: '',
  icon: 'mdi:link-variant',
  size: '1.25em',
  src: '',
  alt: '',
  label: 'Contact us',
  tooltip: '',
  fetchpriority: '',
  anchorClass: '',
  itemClass: '',
  anchorStyle: '',
  unstyled: false,
  nuiType: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'href',
    label: 'href',
    type: 'text',
    section: 'Content',
    placeholder: '#contact',
  },
  {
    key: 'label',
    label: 'label',
    type: 'text',
    section: 'Content',
    placeholder: 'Contact us',
  },
  {
    key: 'icon',
    label: 'icon',
    type: 'text',
    section: 'Content',
    placeholder: 'mdi:link-variant',
  },
  {
    key: 'src',
    label: 'src',
    type: 'text',
    section: 'Content',
    placeholder: 'https://…',
  },
  {
    key: 'alt',
    label: 'alt',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'tooltip',
    label: 'tooltip',
    type: 'text',
    section: 'Content',
    placeholder: 'Opens contact section',
  },
  {
    key: 'anchorClass',
    label: 'anchor-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'itemClass',
    label: 'item-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'size',
    label: 'size',
    type: 'text',
    section: 'Appearance',
    placeholder: '1.25em',
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'anchorStyle',
    label: 'anchor-style',
    type: 'text',
    section: 'Appearance',
    placeholder: 'gap:0.5rem',
  },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'target',
    label: 'target',
    type: 'select',
    section: 'HTML',
    options: [
      { value: '', label: '(default)' },
      { value: '_self', label: '_self' },
      { value: '_blank', label: '_blank' },
      { value: '_parent', label: '_parent' },
      { value: '_top', label: '_top' },
    ],
  },
  {
    key: 'rel',
    label: 'rel',
    type: 'select',
    section: 'HTML',
    options: [
      { value: '', label: '(default)' },
      { value: 'noopener', label: 'noopener' },
      { value: 'noreferrer', label: 'noreferrer' },
      { value: 'nofollow', label: 'nofollow' },
    ],
  },
  {
    key: 'fetchpriority',
    label: 'fetchpriority',
    type: 'select',
    section: 'HTML',
    options: [
      { value: '', label: '(default)' },
      { value: 'high', label: 'high' },
      { value: 'low', label: 'low' },
    ],
  },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <nui-anchor
      href=${whenString(props.href)}
      rel=${whenString(props.rel)}
      target=${whenString(props.target)}
      icon=${whenString(props.icon)}
      size=${whenString(props.size)}
      src=${whenString(props.src)}
      alt=${whenString(props.alt)}
      label=${whenString(props.label)}
      tooltip=${whenString(props.tooltip)}
      fetchpriority=${whenString(props.fetchpriority)}
      anchor-class=${whenString(props.anchorClass)}
      item-class=${whenString(props.itemClass)}
      anchor-style=${whenString(props.anchorStyle)}
      nui-type=${whenString(props.nuiType)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-anchor>
  `;
}

export const nuiAnchorPlayground: PlaygroundDefinition = {
  tag: 'nui-anchor',
  label: 'Anchor',
  description:
    'Link molecule combining optional slot content, icon, image, and label. Supports tooltip wrapper.',
  defaults: NUI_ANCHOR_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-anchor',
      props,
      NUI_ANCHOR_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
