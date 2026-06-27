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
  headingClass: 'heading-class',
};

export const NUI_HEADING_DEFAULTS: PlaygroundProps = {
  text: 'Section title',
  tag: '2',
  unstyled: false,
  nuiType: '',
  headingClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'text',
    label: 'text',
    type: 'text',
    section: 'Content',
    placeholder: 'Section title',
  },
  {
    key: 'tag',
    label: 'tag',
    type: 'select',
    section: 'Content',
    options: [
      { value: '1', label: 'h1' },
      { value: '2', label: 'h2' },
      { value: '3', label: 'h3' },
      { value: '4', label: 'h4' },
      { value: '5', label: 'h5' },
      { value: '6', label: 'h6' },
    ],
  },
  {
    key: 'headingClass',
    label: 'heading-class',
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
    <nui-heading
      text=${String(props.text)}
      .tag=${Number(props.tag)}
      heading-class=${whenString(props.headingClass)}
      nui-type=${whenString(props.nuiType)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-heading>
  `;
}

export const nuiHeadingPlayground: PlaygroundDefinition = {
  tag: 'nui-heading',
  label: 'Heading',
  description:
    'Semantic heading (h1–h6) with text prop and default slot for content.',
  defaults: NUI_HEADING_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-heading',
      props,
      NUI_HEADING_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
