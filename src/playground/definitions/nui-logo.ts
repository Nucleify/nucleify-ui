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
  useSymbol: 'use-symbol',
  lighterColorClass: 'lighter-color-class',
  darkerColorClass: 'darker-color-class',
  nuiType: 'nui-type',
  logoClass: 'logo-class',
};

export const NUI_LOGO_DEFAULTS: PlaygroundProps = {
  dimensions: '44',
  useSymbol: false,
  lighterColorClass: '',
  darkerColorClass: '',
  unstyled: false,
  nuiType: '',
  logoClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'dimensions',
    label: 'dimensions',
    type: 'text',
    section: 'Layout',
    placeholder: '44',
  },
  {
    key: 'lighterColorClass',
    label: 'lighter-color-class',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'darkerColorClass',
    label: 'darker-color-class',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'logoClass',
    label: 'logo-class',
    type: 'text',
    section: 'Appearance',
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'useSymbol',
    label: 'use-symbol',
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
    <nui-logo
      .dimensions=${Number(props.dimensions)}
      lighter-color-class=${whenString(props.lighterColorClass)}
      darker-color-class=${whenString(props.darkerColorClass)}
      logo-class=${whenString(props.logoClass)}
      nui-type=${whenString(props.nuiType)}
      ?use-symbol=${whenBoolean(props.useSymbol)}
      ?unstyled=${whenBoolean(props.unstyled)}
    ></nui-logo>
  `;
}

export const nuiLogoPlayground: PlaygroundDefinition = {
  tag: 'nui-logo',
  label: 'Logo',
  description:
    'Nucleify brand logo with optional nui-type theming and inline SVG or document symbol reference.',
  defaults: NUI_LOGO_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-logo',
      props,
      NUI_LOGO_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
