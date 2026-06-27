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
  strokeWidth: 'stroke-width',
  animationDuration: 'animation-duration',
  nuiType: 'nui-type',
  progressSpinnerClass: 'progress-spinner-class',
};

export const NUI_PROGRESS_SPINNER_DEFAULTS: PlaygroundProps = {
  strokeWidth: '2',
  fill: 'none',
  animationDuration: '2s',
  width: '',
  height: '',
  unstyled: false,
  nuiType: '',
  progressSpinnerClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'progressSpinnerClass',
    label: 'progress-spinner-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'strokeWidth',
    label: 'stroke-width',
    type: 'text',
    section: 'Appearance',
    placeholder: '2',
  },
  {
    key: 'fill',
    label: 'fill',
    type: 'text',
    section: 'Appearance',
    placeholder: 'none',
  },
  {
    key: 'animationDuration',
    label: 'animation-duration',
    type: 'text',
    section: 'Appearance',
    placeholder: '2s',
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
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
    placeholder: '100px',
  },
  {
    key: 'height',
    label: 'height',
    type: 'text',
    section: 'Layout',
    placeholder: '100px',
  },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <nui-progress-spinner
      stroke-width=${whenString(props.strokeWidth)}
      fill=${whenString(props.fill)}
      animation-duration=${whenString(props.animationDuration)}
      width=${whenString(props.width)}
      height=${whenString(props.height)}
      progress-spinner-class=${whenString(props.progressSpinnerClass)}
      nui-type=${whenString(props.nuiType)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-progress-spinner>
  `;
}

export const nuiProgressSpinnerPlayground: PlaygroundDefinition = {
  tag: 'nui-progress-spinner',
  label: 'Progress spinner',
  description:
    'Circular loading indicator with rotating stroke animation (PrimeVue ProgressSpinner).',
  defaults: NUI_PROGRESS_SPINNER_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-progress-spinner',
      props,
      NUI_PROGRESS_SPINNER_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
