import { html, nothing, type TemplateResult } from 'lit';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const ATTRIBUTE_NAMES: Record<string, string> = {
  cardClass: 'card-class',
  nuiType: 'nui-type',
  showHeader: 'show-header',
  showFooter: 'show-footer',
};

export const NUI_CARD_DEFAULTS: PlaygroundProps = {
  title: 'Advanced Card',
  subtitle: 'Card subtitle',
  content:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!',
  showHeader: true,
  showFooter: true,
  cardClass: '',
  unstyled: false,
  nuiType: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'title',
    label: 'title',
    type: 'text',
    section: 'Content',
    placeholder: 'Advanced Card',
  },
  {
    key: 'subtitle',
    label: 'subtitle',
    type: 'text',
    section: 'Content',
    placeholder: 'Card subtitle',
  },
  {
    key: 'content',
    label: 'content',
    type: 'textarea',
    section: 'Content',
    rows: 5,
    fullWidth: true,
    placeholder: 'Card body text',
  },
  {
    key: 'cardClass',
    label: 'card-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'showHeader',
    label: 'show-header',
    type: 'boolean',
    section: 'Content',
  },
  {
    key: 'showFooter',
    label: 'show-footer',
    type: 'boolean',
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
  const showHeader = whenBoolean(props.showHeader);
  const showFooter = whenBoolean(props.showFooter);

  return html`
    <div class="card-preview">
      <nui-card
        title=${whenString(props.title)}
        subtitle=${whenString(props.subtitle)}
        card-class=${whenString(props.cardClass)}
        nui-type=${whenString(props.nuiType)}
        ?unstyled=${whenBoolean(props.unstyled)}
      >
        ${
          showHeader
            ? html`
                <img
                  slot="header"
                  src="https://nucleify.io/img/og-image.png"
                  alt="Nucleify"
                />
              `
            : nothing
        }
        <nui-paragraph text=${whenString(props.content)} unstyled></nui-paragraph>
        ${
          showFooter
            ? html`
                <div slot="footer">
                  <button type="button" class="nui-card-cancel">Cancel</button>
                  <nui-button label="Save"></nui-button>
                </div>
              `
            : nothing
        }
      </nui-card>
    </div>
  `;
}

export const nuiCardPlayground: PlaygroundDefinition = {
  tag: 'nui-card',
  label: 'Card',
  description:
    'Flexible container with header, title, subtitle, content, and footer sections.',
  defaults: NUI_CARD_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) => {
    const {
      content: _content,
      showHeader: _showHeader,
      showFooter: _showFooter,
      ...usageProps
    } = props;

    return formatUsageFromDefaults(
      'nui-card',
      usageProps,
      NUI_CARD_DEFAULTS,
      ATTRIBUTE_NAMES,
    );
  },
};
