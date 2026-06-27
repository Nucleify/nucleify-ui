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
  onIcon: 'on-icon',
  offIcon: 'off-icon',
  nuiType: 'nui-type',
  ratingClass: 'rating-class',
};

export const NUI_RATING_DEFAULTS: PlaygroundProps = {
  value: '3',
  name: '',
  stars: '5',
  disabled: false,
  readonly: false,
  invalid: false,
  onIcon: '',
  offIcon: '',
  unstyled: false,
  nuiType: '',
  ratingClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value',
    type: 'text',
    section: 'Content',
    placeholder: '3',
  },
  {
    key: 'name',
    label: 'name',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'ratingClass',
    label: 'rating-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'stars',
    label: 'stars',
    type: 'text',
    section: 'Appearance',
    placeholder: '5',
  },
  {
    key: 'onIcon',
    label: 'on-icon',
    type: 'text',
    section: 'Appearance',
    placeholder: 'mdi:star',
  },
  {
    key: 'offIcon',
    label: 'off-icon',
    type: 'text',
    section: 'Appearance',
    placeholder: 'mdi:star-outline',
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  { key: 'disabled', label: 'disabled', type: 'boolean', section: 'State' },
  { key: 'readonly', label: 'readonly', type: 'boolean', section: 'State' },
  { key: 'invalid', label: 'invalid', type: 'boolean', section: 'State' },
];

function renderPreview(props: PlaygroundProps): TemplateResult {
  return html`
    <nui-rating
      value=${Number(props.value)}
      stars=${Number(props.stars)}
      name=${whenString(props.name)}
      on-icon=${whenString(props.onIcon)}
      off-icon=${whenString(props.offIcon)}
      rating-class=${whenString(props.ratingClass)}
      nui-type=${whenString(props.nuiType)}
      ?disabled=${whenBoolean(props.disabled)}
      ?readonly=${whenBoolean(props.readonly)}
      ?invalid=${whenBoolean(props.invalid)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-rating>
  `;
}

export const nuiRatingPlayground: PlaygroundDefinition = {
  tag: 'nui-rating',
  label: 'Rating',
  description:
    'Star-based rating input with configurable icons and star count.',
  defaults: NUI_RATING_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-rating',
      props,
      NUI_RATING_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
