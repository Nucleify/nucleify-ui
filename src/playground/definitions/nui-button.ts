import { html, type TemplateResult } from 'lit';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundProps,
  whenBoolean,
  whenString,
  whenStringNotDefault,
} from '../types.js';

const ATTRIBUTE_NAMES: Record<string, string> = {
  iconPos: 'icon-pos',
  iconClass: 'icon-class',
  badgeClass: 'badge-class',
  badgeSeverity: 'badge-severity',
  loadingIcon: 'loading-icon',
  nuiType: 'nui-type',
  buttonClass: 'button-class',
  buttonStyle: 'button-style',
};

export const NUI_BUTTON_DEFAULTS: PlaygroundProps = {
  label: 'Click me',
  variant: 'primary',
  severity: '',
  disabled: false,
  type: 'button',
  icon: '',
  iconPos: 'left',
  iconClass: '',
  badge: '',
  badgeClass: '',
  badgeSeverity: 'secondary',
  loading: false,
  loadingIcon: '',
  link: false,
  raised: false,
  rounded: false,
  text: false,
  outlined: false,
  size: '',
  plain: false,
  fluid: false,
  unstyled: false,
  nuiType: '',
  media: '',
  alt: '',
  width: '',
  height: '',
  gap: '',
  padding: '',
  src: '',
  buttonClass: '',
  buttonStyle: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'label',
    label: 'label',
    type: 'text',
    section: 'Content',
    placeholder: 'Button',
  },
  {
    key: 'icon',
    label: 'icon',
    type: 'text',
    section: 'Content',
    placeholder: 'mdi:check',
  },
  {
    key: 'iconPos',
    label: 'icon-pos',
    type: 'select',
    section: 'Content',
    options: [
      { value: 'left', label: 'left' },
      { value: 'right', label: 'right' },
      { value: 'top', label: 'top' },
      { value: 'bottom', label: 'bottom' },
    ],
  },
  {
    key: 'iconClass',
    label: 'icon-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'badge',
    label: 'badge',
    type: 'text',
    section: 'Content',
    placeholder: '3',
  },
  {
    key: 'badgeClass',
    label: 'badge-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'badgeSeverity',
    label: 'badge-severity',
    type: 'select',
    section: 'Content',
    options: [
      { value: 'secondary', label: 'secondary' },
      { value: 'success', label: 'success' },
      { value: 'info', label: 'info' },
      { value: 'warn', label: 'warn' },
      { value: 'help', label: 'help' },
      { value: 'danger', label: 'danger' },
      { value: 'contrast', label: 'contrast' },
    ],
  },
  {
    key: 'src',
    label: 'src',
    type: 'text',
    section: 'Content',
    placeholder: 'https://...',
  },
  { key: 'alt', label: 'alt', type: 'text', section: 'Content' },
  {
    key: 'media',
    label: 'media',
    type: 'select',
    section: 'Content',
    options: [
      { value: '', label: '(none)' },
      { value: 'image', label: 'image' },
      { value: 'icon', label: 'icon' },
    ],
  },
  {
    key: 'variant',
    label: 'variant',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'primary', label: 'primary' },
      { value: 'secondary', label: 'secondary' },
      { value: 'outlined', label: 'outlined' },
      { value: 'text', label: 'text' },
      { value: 'link', label: 'link' },
    ],
  },
  {
    key: 'severity',
    label: 'severity',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: '(default)' },
      { value: 'secondary', label: 'secondary' },
      { value: 'success', label: 'success' },
      { value: 'info', label: 'info' },
      { value: 'warn', label: 'warn' },
      { value: 'help', label: 'help' },
      { value: 'danger', label: 'danger' },
      { value: 'contrast', label: 'contrast' },
    ],
  },
  {
    key: 'size',
    label: 'size',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: '(default)' },
      { value: 'small', label: 'small' },
      { value: 'large', label: 'large' },
    ],
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  { key: 'link', label: 'link', type: 'boolean', section: 'Modifiers' },
  { key: 'raised', label: 'raised', type: 'boolean', section: 'Modifiers' },
  {
    key: 'rounded',
    label: 'rounded',
    type: 'boolean',
    section: 'Modifiers',
  },
  { key: 'text', label: 'text', type: 'boolean', section: 'Modifiers' },
  {
    key: 'outlined',
    label: 'outlined',
    type: 'boolean',
    section: 'Modifiers',
  },
  { key: 'plain', label: 'plain', type: 'boolean', section: 'Modifiers' },
  { key: 'fluid', label: 'fluid', type: 'boolean', section: 'Modifiers' },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  { key: 'loading', label: 'loading', type: 'boolean', section: 'State' },
  {
    key: 'loadingIcon',
    label: 'loading-icon',
    type: 'text',
    section: 'State',
    placeholder: 'svg-spinners:90-ring-with-bg',
  },
  {
    key: 'width',
    label: 'width',
    type: 'text',
    section: 'Layout',
    placeholder: '200px',
  },
  { key: 'height', label: 'height', type: 'text', section: 'Layout' },
  { key: 'gap', label: 'gap', type: 'text', section: 'Layout' },
  { key: 'padding', label: 'padding', type: 'text', section: 'Layout' },
  {
    key: 'buttonClass',
    label: 'button-class',
    type: 'text',
    section: 'Layout',
  },
  {
    key: 'buttonStyle',
    label: 'button-style',
    type: 'text',
    section: 'Layout',
    placeholder: 'opacity: 1',
  },
  {
    key: 'type',
    label: 'type',
    type: 'select',
    section: 'HTML',
    options: [
      { value: 'button', label: 'button' },
      { value: 'submit', label: 'submit' },
      { value: 'reset', label: 'reset' },
    ],
  },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <nui-button
      label=${String(props.label)}
      variant=${whenStringNotDefault(props.variant, 'primary')}
      severity=${whenString(props.severity)}
      type=${whenStringNotDefault(props.type, 'button')}
      icon=${whenString(props.icon)}
      icon-pos=${whenStringNotDefault(props.iconPos, 'left')}
      icon-class=${whenString(props.iconClass)}
      badge=${whenString(props.badge)}
      badge-class=${whenString(props.badgeClass)}
      badge-severity=${whenStringNotDefault(props.badgeSeverity, 'secondary')}
      loading-icon=${whenString(props.loadingIcon)}
      nui-type=${whenString(props.nuiType)}
      media=${whenString(props.media)}
      alt=${whenString(props.alt)}
      width=${whenString(props.width)}
      height=${whenString(props.height)}
      gap=${whenString(props.gap)}
      padding=${whenString(props.padding)}
      src=${whenString(props.src)}
      button-class=${whenString(props.buttonClass)}
      button-style=${whenString(props.buttonStyle)}
      size=${whenString(props.size)}
      ?disabled=${whenBoolean(props.disabled)}
      ?loading=${whenBoolean(props.loading)}
      ?link=${whenBoolean(props.link)}
      ?raised=${whenBoolean(props.raised)}
      ?rounded=${whenBoolean(props.rounded)}
      ?text=${whenBoolean(props.text)}
      ?outlined=${whenBoolean(props.outlined)}
      ?plain=${whenBoolean(props.plain)}
      ?fluid=${whenBoolean(props.fluid)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-button>
  `;
}

export const nuiButtonPlayground: PlaygroundDefinition = {
  tag: 'nui-button',
  label: 'Button',
  description:
    'Button with severity, variant, icon, badge, loading and layout options.',
  defaults: NUI_BUTTON_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-button',
      props,
      NUI_BUTTON_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
  getPreviewClass: (props) => (props.fluid ? 'is-fluid' : ''),
};
