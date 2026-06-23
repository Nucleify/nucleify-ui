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
  imageClass: 'image-class',
  imageStyle: 'image-style',
  nuiType: 'nui-type',
};

export const NUI_IMAGE_DEFAULTS: PlaygroundProps = {
  src: 'https://nucleify.io/img/og-image.png',
  alt: 'Sample image',
  width: '',
  height: '',
  fit: '',
  loading: '',
  fetchpriority: '',
  preview: false,
  imageClass: '',
  imageStyle: '',
  unstyled: false,
  nuiType: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'src',
    label: 'src',
    type: 'text',
    section: 'Content',
    placeholder: 'https://...',
  },
  {
    key: 'alt',
    label: 'alt',
    type: 'text',
    section: 'Content',
    placeholder: 'Sample image',
  },
  {
    key: 'imageClass',
    label: 'image-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'fit',
    label: 'fit',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: '(default)' },
      { value: 'cover', label: 'cover' },
      { value: 'contain', label: 'contain' },
      { value: 'fill', label: 'fill' },
      { value: 'none', label: 'none' },
      { value: 'scale-down', label: 'scale-down' },
    ],
  },
  {
    key: 'loading',
    label: 'loading',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: '(default)' },
      { value: 'lazy', label: 'lazy' },
      { value: 'eager', label: 'eager' },
    ],
  },
  {
    key: 'fetchpriority',
    label: 'fetchpriority',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: '(default)' },
      { value: 'high', label: 'high' },
      { value: 'low', label: 'low' },
      { value: 'auto', label: 'auto' },
    ],
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'preview',
    label: 'preview',
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
    key: 'width',
    label: 'width',
    type: 'text',
    section: 'Layout',
    placeholder: '320px',
  },
  {
    key: 'height',
    label: 'height',
    type: 'text',
    section: 'Layout',
    placeholder: '180px',
  },
  {
    key: 'imageStyle',
    label: 'image-style',
    type: 'text',
    section: 'Layout',
    placeholder: 'border-radius: 8px',
  },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <nui-image
      src=${String(props.src)}
      alt=${String(props.alt)}
      width=${whenString(props.width)}
      height=${whenString(props.height)}
      fit=${whenString(props.fit)}
      loading=${whenString(props.loading)}
      fetchpriority=${whenString(props.fetchpriority)}
      image-class=${whenString(props.imageClass)}
      image-style=${whenString(props.imageStyle)}
      nui-type=${whenString(props.nuiType)}
      ?preview=${whenBoolean(props.preview)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-image>
  `;
}

export const nuiImagePlayground: PlaygroundDefinition = {
  tag: 'nui-image',
  label: 'Image',
  description:
    'Image with fit, loading, fetch priority, and optional preview overlay.',
  defaults: NUI_IMAGE_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-image',
      props,
      NUI_IMAGE_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
