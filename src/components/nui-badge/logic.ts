import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { BadgeSeverity, BadgeSize } from './types.js';

export interface NuiBadgeViewState {
  value: string;
  severity: BadgeSeverity | '';
  size: BadgeSize | '';
  nuiType: NuiType;
  badgeClass: string;
  lightDomHasContent: boolean;
}

export function resolveSeverity(
  state: Pick<NuiBadgeViewState, 'severity'>,
): BadgeSeverity | 'primary' {
  if (state.severity) {
    return state.severity;
  }
  return 'primary';
}

export function isBadgeDot(
  state: Pick<NuiBadgeViewState, 'value' | 'lightDomHasContent'>,
): boolean {
  return !state.value && !state.lightDomHasContent;
}

export function isBadgeCircle(value: string): boolean {
  return value.length === 1;
}

export function getBadgeClass(badgeClass: string): string {
  return ['nui-badge', badgeClass].filter(Boolean).join(' ');
}

export function renderBadge(state: NuiBadgeViewState): TemplateResult {
  const severity = resolveSeverity(state);
  const showSeverity = Boolean(state.severity);
  const dot = isBadgeDot(state);
  const circle = !dot && isBadgeCircle(state.value);

  return html`
    <span
      class=${getBadgeClass(state.badgeClass)}
      severity=${showSeverity ? severity : nothing}
      size=${state.size || nothing}
      nui-type=${state.nuiType || nothing}
      ?dot=${dot || nothing}
      ?circle=${circle || nothing}
    >
      <slot>${state.value || nothing}</slot>
    </span>
  `;
}
