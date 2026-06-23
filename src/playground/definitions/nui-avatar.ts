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
  ariaLabel: 'aria-label',
  ariaLabelledby: 'aria-labelledby',
  nuiType: 'nui-type',
  avatarClass: 'avatar-class',
};

export const NUI_AVATAR_DEFAULTS: PlaygroundProps = {
  label: '',
  icon: 'mdi:account',
  image: '',
  size: '',
  shape: 'circle',
  ariaLabel: '',
  ariaLabelledby: '',
  unstyled: false,
  nuiType: '',
  avatarClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'label',
    label: 'label',
    type: 'text',
    section: 'Content',
    placeholder: 'AB',
  },
  {
    key: 'icon',
    label: 'icon',
    type: 'text',
    section: 'Content',
    placeholder: 'mdi:account',
  },
  {
    key: 'image',
    label: 'image',
    type: 'text',
    section: 'Content',
    placeholder: 'https://...',
  },
  {
    key: 'avatarClass',
    label: 'avatar-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'shape',
    label: 'shape',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: 'square' },
      { value: 'circle', label: 'circle' },
    ],
  },
  {
    key: 'size',
    label: 'size',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: '(normal)' },
      { value: 'large', label: 'large' },
      { value: 'xlarge', label: 'xlarge' },
    ],
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'ariaLabel',
    label: 'aria-label',
    type: 'text',
    section: 'HTML',
  },
  {
    key: 'ariaLabelledby',
    label: 'aria-labelledby',
    type: 'text',
    section: 'HTML',
  },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <nui-avatar
      label=${whenString(props.label)}
      icon=${whenString(props.icon)}
      image=${whenString(props.image)}
      size=${whenString(props.size)}
      shape=${whenString(props.shape)}
      aria-label=${whenString(props.ariaLabel)}
      aria-labelledby=${whenString(props.ariaLabelledby)}
      avatar-class=${whenString(props.avatarClass)}
      nui-type=${whenString(props.nuiType)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-avatar>
  `;
}

export const nuiAvatarPlayground: PlaygroundDefinition = {
  tag: 'nui-avatar',
  label: 'Avatar',
  description:
    'Avatar with label, icon, or image. Content priority: label, icon, image.',
  defaults: NUI_AVATAR_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-avatar',
      props,
      NUI_AVATAR_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
