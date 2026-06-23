import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { AvatarShape, AvatarSize } from './types.js';

export interface NuiAvatarViewState {
  label: string;
  icon: string;
  image: string;
  size: AvatarSize | '';
  shape: AvatarShape | '';
  ariaLabel: string;
  ariaLabelledby: string;
  nuiType: NuiType;
  avatarClass: string;
}

export function resolveAvatarShape(shape: AvatarShape | ''): AvatarShape {
  return shape || 'square';
}

export function getAvatarClass(avatarClass: string): string {
  return ['nui-avatar', avatarClass].filter(Boolean).join(' ');
}

export function getAvatarIconSize(size: AvatarSize | ''): {
  width: string;
  height: string;
} {
  switch (size) {
    case 'large':
      return { width: '1.5rem', height: '1.5rem' };
    case 'xlarge':
      return { width: '2rem', height: '2rem' };
    default:
      return { width: '1rem', height: '1rem' };
  }
}

export function renderAvatarIcon(
  state: Pick<NuiAvatarViewState, 'icon' | 'size'>,
): TemplateResult | typeof nothing {
  if (!state.icon) {
    return nothing;
  }

  const { width, height } = getAvatarIconSize(state.size);

  return html`
    <nui-icon
      class="nui-avatar-icon"
      icon=${state.icon}
      width=${width}
      height=${height}
      aria-hidden="true"
    ></nui-icon>
  `;
}

export function renderAvatarLabel(
  label: string,
): TemplateResult | typeof nothing {
  if (!label) {
    return nothing;
  }

  return html`<span class="nui-avatar-label">${label}</span>`;
}

export function renderAvatarImage(
  state: Pick<NuiAvatarViewState, 'image' | 'ariaLabel'>,
  onError: (event: Event) => void,
): TemplateResult | typeof nothing {
  if (!state.image) {
    return nothing;
  }

  return html`
    <img
      class="nui-avatar-image"
      src=${state.image}
      alt=${state.ariaLabel || nothing}
      @error=${onError}
    />
  `;
}

export function renderAvatarDefaultContent(
  state: NuiAvatarViewState,
  onError: (event: Event) => void,
): TemplateResult | typeof nothing {
  if (state.label) {
    return renderAvatarLabel(state.label);
  }

  if (state.icon) {
    return renderAvatarIcon(state);
  }

  return renderAvatarImage(state, onError);
}

export function renderAvatar(
  state: NuiAvatarViewState,
  onError: (event: Event) => void,
): TemplateResult {
  const shape = resolveAvatarShape(state.shape);

  return html`
    <span
      class=${getAvatarClass(state.avatarClass)}
      shape=${shape}
      size=${state.size || nothing}
      nui-type=${state.nuiType || nothing}
      ?image=${state.image || nothing}
      aria-label=${state.ariaLabel || nothing}
      aria-labelledby=${state.ariaLabelledby || nothing}
      role=${state.ariaLabel || state.ariaLabelledby ? 'img' : nothing}
    >
      <slot>${renderAvatarDefaultContent(state, onError)}</slot>
    </span>
  `;
}
