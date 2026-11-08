import { html, type TemplateResult } from 'lit';
import { DEFAULT_LOGO_COMBINED_SVG } from '../../components/nui-logo/logo-paths.js';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const ATTRIBUTE_NAMES: Record<string, string> = {
  dimensions: 'dimensions',
  svg: 'svg',
  mode: 'mode',
  useSymbol: 'use-symbol',
  lighterColorClass: 'lighter-color-class',
  darkerColorClass: 'darker-color-class',
  nuiType: 'nui-type',
  logoClass: 'logo-class',
};

export const NUI_LOGO_DEFAULTS: PlaygroundProps = {
  dimensions: '80',
  svg: DEFAULT_LOGO_COMBINED_SVG,
  mode: '',
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
    placeholder: '80',
  },
  {
    key: 'svg',
    label: 'svg (SVG string or markup with dark/light variants)',
    type: 'textarea',
    section: 'Content',
    rows: 10,
    fullWidth: true,
  },
  {
    key: 'mode',
    label: 'mode',
    type: 'select',
    section: 'Appearance',
    options: [
      { label: '(automatic by theme)', value: '' },
      { label: 'dark', value: 'dark' },
      { label: 'light', value: 'light' },
    ],
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
      .svg=${String(props.svg ?? '')}
      .lighterColorClass=${String(props.lighterColorClass ?? '')}
      .darkerColorClass=${String(props.darkerColorClass ?? '')}
      .logoClass=${String(props.logoClass ?? '')}
      mode=${whenString(props.mode)}
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
