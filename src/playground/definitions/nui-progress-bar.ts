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
  showValue: 'show-value',
  nuiType: 'nui-type',
  progressBarClass: 'progress-bar-class',
};

export const NUI_PROGRESS_BAR_DEFAULTS: PlaygroundProps = {
  value: '50',
  mode: 'determinate',
  showValue: true,
  width: '',
  height: '',
  unstyled: false,
  nuiType: '',
  progressBarClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: '50',
  },
  {
    key: 'progressBarClass',
    label: 'progress-bar-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'mode',
    label: 'mode',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'determinate', label: 'determinate' },
      { value: 'indeterminate', label: 'indeterminate' },
    ],
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'showValue',
    label: 'show-value',
    type: 'boolean',
    section: 'Appearance',
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
    placeholder: '100%',
  },
  {
    key: 'height',
    label: 'height',
    type: 'text',
    section: 'Layout',
    placeholder: '1.25rem',
  },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <nui-progress-bar
      value=${Number(props.value)}
      mode=${String(props.mode)}
      width=${whenString(props.width)}
      height=${whenString(props.height)}
      progress-bar-class=${whenString(props.progressBarClass)}
      nui-type=${whenString(props.nuiType)}
      .showValue=${Boolean(props.showValue)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-progress-bar>
  `;
}

export const nuiProgressBarPlayground: PlaygroundDefinition = {
  tag: 'nui-progress-bar',
  label: 'Progress bar',
  description:
    'Horizontal progress indicator with determinate or indeterminate mode.',
  defaults: NUI_PROGRESS_BAR_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  getPreviewClass: () => 'is-fluid',
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-progress-bar',
      props,
      NUI_PROGRESS_BAR_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
