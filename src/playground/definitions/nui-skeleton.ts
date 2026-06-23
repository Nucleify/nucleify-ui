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
  borderRadius: 'border-radius',
  nuiType: 'nui-type',
  skeletonClass: 'skeleton-class',
};

export const NUI_SKELETON_DEFAULTS: PlaygroundProps = {
  shape: '',
  size: '',
  width: '12rem',
  height: '',
  borderRadius: '',
  animation: '',
  unstyled: false,
  nuiType: '',
  skeletonClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'skeletonClass',
    label: 'skeleton-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'shape',
    label: 'shape',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: 'rectangle' },
      { value: 'circle', label: 'circle' },
    ],
  },
  {
    key: 'animation',
    label: 'animation',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: '', label: 'wave' },
      { value: 'none', label: 'none' },
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
    key: 'size',
    label: 'size',
    type: 'text',
    section: 'Layout',
    placeholder: '4rem',
  },
  {
    key: 'width',
    label: 'width',
    type: 'text',
    section: 'Layout',
    placeholder: '12rem',
  },
  {
    key: 'height',
    label: 'height',
    type: 'text',
    section: 'Layout',
    placeholder: '1rem',
  },
  {
    key: 'borderRadius',
    label: 'border-radius',
    type: 'text',
    section: 'Layout',
    placeholder: '16px',
  },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <nui-skeleton
      shape=${whenString(props.shape)}
      size=${whenString(props.size)}
      width=${whenString(props.width)}
      height=${whenString(props.height)}
      border-radius=${whenString(props.borderRadius)}
      animation=${whenString(props.animation)}
      skeleton-class=${whenString(props.skeletonClass)}
      nui-type=${whenString(props.nuiType)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-skeleton>
  `;
}

export const nuiSkeletonPlayground: PlaygroundDefinition = {
  tag: 'nui-skeleton',
  label: 'Skeleton',
  description:
    'Loading placeholder with rectangle or circle shape and wave animation.',
  defaults: NUI_SKELETON_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-skeleton',
      props,
      NUI_SKELETON_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
