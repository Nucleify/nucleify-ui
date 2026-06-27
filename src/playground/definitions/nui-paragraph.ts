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
  paragraphClass: 'paragraph-class',
};

export const NUI_PARAGRAPH_DEFAULTS: PlaygroundProps = {
  text: 'Paragraph text with supporting details for the section.',
  unstyled: false,
  nuiType: '',
  paragraphClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'text',
    label: 'text',
    type: 'text',
    section: 'Content',
    placeholder: 'Paragraph text',
  },
  {
    key: 'paragraphClass',
    label: 'paragraph-class',
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
    <nui-paragraph
      text=${String(props.text)}
      paragraph-class=${whenString(props.paragraphClass)}
      nui-type=${whenString(props.nuiType)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-paragraph>
  `;
}

export const nuiParagraphPlayground: PlaygroundDefinition = {
  tag: 'nui-paragraph',
  label: 'Paragraph',
  description: 'Body paragraph with text prop and default slot for content.',
  defaults: NUI_PARAGRAPH_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  getPreviewClass: () => 'is-fluid',
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-paragraph',
      props,
      NUI_PARAGRAPH_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
