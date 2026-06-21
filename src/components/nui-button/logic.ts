import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type {
  BadgeSeverity,
  ButtonIconPosition,
  ButtonMedia,
  ButtonSeverity,
  ButtonSize,
  ButtonType,
  ButtonVariant,
} from './types.js';

export interface NuiButtonViewState {
  label: string;
  variant: ButtonVariant;
  severity: ButtonSeverity | '';
  disabled: boolean;
  type: ButtonType;
  icon: string;
  iconPos: ButtonIconPosition;
  iconClass: string;
  badge: string;
  badgeClass: string;
  badgeSeverity: BadgeSeverity;
  loading: boolean;
  loadingIcon: string;
  link: boolean;
  raised: boolean;
  rounded: boolean;
  text: boolean;
  outlined: boolean;
  size: ButtonSize | '';
  plain: boolean;
  fluid: boolean;
  nuiType: NuiType;
  media: ButtonMedia | '';
  alt: string;
  width: string;
  height: string;
  gap: string;
  padding: string;
  src: string;
  buttonClass: string;
  buttonStyle: string;
}

export function resolveSeverity(
  state: Pick<NuiButtonViewState, 'severity' | 'variant'>,
): ButtonSeverity | 'primary' {
  if (state.severity) {
    return state.severity;
  }
  if (state.variant === 'secondary') {
    return 'secondary';
  }
  return 'primary';
}

export function resolveVisualVariant(
  state: Pick<
    NuiButtonViewState,
    'link' | 'variant' | 'text' | 'plain' | 'outlined'
  >,
): 'solid' | 'outlined' | 'text' | 'link' {
  if (state.link || state.variant === 'link') {
    return 'link';
  }
  if (state.text || state.variant === 'text' || state.plain) {
    return 'text';
  }
  if (state.outlined || state.variant === 'outlined') {
    return 'outlined';
  }
  return 'solid';
}

export function getButtonClass(buttonClass: string): string {
  return ['nui-button', buttonClass].filter(Boolean).join(' ');
}

export function getInlineStyles(
  state: Pick<
    NuiButtonViewState,
    'width' | 'height' | 'gap' | 'padding' | 'buttonStyle'
  >,
): string {
  const stylesList: string[] = [];

  if (state.width) stylesList.push(`width:${state.width}`);
  if (state.height) stylesList.push(`height:${state.height}`);
  if (state.gap) stylesList.push(`gap:${state.gap}`);
  if (state.padding) stylesList.push(`padding:${state.padding}`);
  if (state.buttonStyle) stylesList.push(state.buttonStyle);

  return stylesList.join(';');
}

export const DEFAULT_LOADING_ICON = 'svg-spinners:90-ring-with-bg';

export function renderIcon(
  icon: string,
  iconWrapperClass: string,
): TemplateResult {
  return html`
    <nui-icon
      class="nui-button-icon ${iconWrapperClass}"
      icon=${icon}
      aria-hidden="true"
    ></nui-icon>
  `;
}

export function renderLoadingIcon(
  loadingIcon: string,
  iconClass: string,
): TemplateResult {
  const icon = loadingIcon || DEFAULT_LOADING_ICON;

  return html`
    <nui-icon
      class="nui-button-loading ${iconClass}"
      icon=${icon}
      aria-hidden="true"
    ></nui-icon>
  `;
}

export function renderMedia(
  state: Pick<NuiButtonViewState, 'src' | 'media' | 'alt'>,
): TemplateResult | typeof nothing {
  if (!state.src && state.media !== 'image') {
    return nothing;
  }

  return html`
    <img
      class="nui-button-media"
      src=${state.src}
      alt=${state.alt}
    />
  `;
}

export function renderBadge(
  state: Pick<NuiButtonViewState, 'badge' | 'badgeSeverity' | 'badgeClass'>,
): TemplateResult | typeof nothing {
  if (!state.badge) {
    return nothing;
  }

  return html`
    <span
      class="nui-button-badge ${state.badgeClass}"
      severity=${state.badgeSeverity}
    >
      ${state.badge}
    </span>
  `;
}

export function renderLabel(label: string): TemplateResult | typeof nothing {
  if (!label) {
    return nothing;
  }

  return html`<span class="nui-button-label">${label}</span>`;
}

export function renderButton(state: NuiButtonViewState): TemplateResult {
  const showIcon = Boolean(state.icon) && !state.loading;
  const isDisabled = state.disabled || state.loading;
  const inlineStyles = getInlineStyles(state);
  const severity = resolveSeverity(state);
  const visualVariant = resolveVisualVariant(state);
  const showSeverity = Boolean(state.severity) || state.variant === 'secondary';

  return html`
    <button
      class=${getButtonClass(state.buttonClass)}
      style=${inlineStyles || nothing}
      type=${state.type}
      severity=${showSeverity ? severity : nothing}
      variant=${visualVariant !== 'solid' ? visualVariant : nothing}
      size=${state.size || nothing}
      icon-pos=${state.iconPos !== 'left' ? state.iconPos : nothing}
      media=${state.media || nothing}
      nui-type=${state.nuiType || nothing}
      ?raised=${state.raised || nothing}
      ?rounded=${state.rounded || nothing}
      ?fluid=${state.fluid || nothing}
      ?loading=${state.loading || nothing}
      ?disabled=${isDisabled || nothing}
      aria-busy=${state.loading ? 'true' : nothing}
    >
      ${state.loading ? renderLoadingIcon(state.loadingIcon, state.iconClass) : nothing}
      ${!state.loading ? renderMedia(state) : nothing}
      ${showIcon ? renderIcon(state.icon, state.iconClass) : nothing}
      ${renderLabel(state.label)}
      <slot></slot>
      ${renderBadge(state)}
    </button>
  `;
}
