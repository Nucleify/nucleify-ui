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
  nuiType: 'nui-type',
  scrollTopClass: 'scroll-top-class',
  scrollContainer: 'scroll-container',
};

export const NUI_SCROLL_TOP_DEFAULTS: PlaygroundProps = {
  target: 'parent',
  threshold: '400',
  scrollContainer: '.scroll-top-demo-viewport',
  icon: '',
  behavior: 'smooth',
  rounded: true,
  unstyled: false,
  nuiType: '',
  scrollTopClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'scrollContainer',
    label: 'scroll-container',
    type: 'text',
    section: 'Content',
    placeholder: '.scroll-top-demo-viewport',
  },
  {
    key: 'scrollTopClass',
    label: 'scroll-top-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'target',
    label: 'target',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'parent', label: 'parent' },
      { value: 'window', label: 'window' },
    ],
  },
  {
    key: 'threshold',
    label: 'threshold',
    type: 'text',
    section: 'Appearance',
    placeholder: '400',
  },
  {
    key: 'icon',
    label: 'icon',
    type: 'text',
    section: 'Appearance',
    placeholder: 'mdi:chevron-up',
  },
  {
    key: 'behavior',
    label: 'behavior',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'smooth', label: 'smooth' },
      { value: 'auto', label: 'auto' },
    ],
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'rounded',
    label: 'rounded',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <div class="scroll-top-demo">
      <div class="scroll-top-demo-viewport">
        <div class="scroll-top-demo-content">
          <p>Scroll this panel to reveal the scroll-top button.</p>
          <p>
            <code>target="parent"</code> pins the button inside this panel.
            <code>target="window"</code> fixes it to the page corner.
          </p>
          <p>With <code>threshold=400</code>, scroll this panel most of the way down.</p>
        </div>
      </div>
      <nui-scroll-top
        target=${String(props.target)}
        .threshold=${Number(props.threshold) || 400}
        scroll-container=${whenString(props.scrollContainer)}
        behavior=${String(props.behavior)}
        icon=${whenString(props.icon)}
        scroll-top-class=${whenString(props.scrollTopClass)}
        nui-type=${whenString(props.nuiType)}
        ?rounded=${whenBoolean(props.rounded)}
        ?unstyled=${whenBoolean(props.unstyled)}
      ></nui-scroll-top>
    </div>
  `;
}

export const nuiScrollTopPlayground: PlaygroundDefinition = {
  tag: 'nui-scroll-top',
  label: 'Scroll top',
  description:
    'Floating button that appears after scrolling and returns to the top.',
  defaults: NUI_SCROLL_TOP_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  getPreviewClass: () => 'is-fluid',
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-scroll-top',
      props,
      NUI_SCROLL_TOP_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
