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
  tooltipId: 'tooltip-id',
  tooltipClass: 'tooltip-class',
  fitContent: 'fit-content',
  showDelay: 'show-delay',
  hideDelay: 'hide-delay',
  autoHide: 'auto-hide',
  nuiType: 'nui-type',
};

export const NUI_TOOLTIP_DEFAULTS: PlaygroundProps = {
  value: 'Save your changes',
  disabled: false,
  tooltipId: '',
  tooltipClass: '',
  escape: true,
  fitContent: true,
  showDelay: '0',
  hideDelay: '0',
  autoHide: true,
  position: 'right',
  unstyled: false,
  nuiType: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: 'Save your changes',
  },
  {
    key: 'tooltipClass',
    label: 'tooltip-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'position',
    label: 'position',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'right', label: 'right' },
      { value: 'left', label: 'left' },
      { value: 'top', label: 'top' },
      { value: 'bottom', label: 'bottom' },
    ],
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  { key: 'escape', label: 'escape', type: 'boolean', section: 'State' },
  {
    key: 'fitContent',
    label: 'fit-content',
    type: 'boolean',
    section: 'State',
  },
  { key: 'autoHide', label: 'auto-hide', type: 'boolean', section: 'State' },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  {
    key: 'showDelay',
    label: 'show-delay',
    type: 'text',
    section: 'State',
    placeholder: '0',
  },
  {
    key: 'hideDelay',
    label: 'hide-delay',
    type: 'text',
    section: 'State',
    placeholder: '0',
  },
  {
    key: 'tooltipId',
    label: 'tooltip-id',
    type: 'text',
    section: 'HTML',
  },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <nui-tooltip
      value=${whenString(props.value)}
      tooltip-id=${whenString(props.tooltipId)}
      tooltip-class=${whenString(props.tooltipClass)}
      position=${whenString(props.position)}
      nui-type=${whenString(props.nuiType)}
      show-delay=${Number(props.showDelay)}
      hide-delay=${Number(props.hideDelay)}
      ?disabled=${whenBoolean(props.disabled)}
      ?escape=${whenBoolean(props.escape)}
      ?fit-content=${whenBoolean(props.fitContent)}
      ?auto-hide=${whenBoolean(props.autoHide)}
      ?unstyled=${whenBoolean(props.unstyled)}
    >
      <nui-button label="Hover or focus me"></nui-button>
    </nui-tooltip>
  `;
}

export const nuiTooltipPlayground: PlaygroundDefinition = {
  tag: 'nui-tooltip',
  label: 'Tooltip',
  description:
    'Advisory text shown on hover or focus. Wraps a trigger element in the default slot.',
  defaults: NUI_TOOLTIP_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-tooltip',
      props,
      NUI_TOOLTIP_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
