import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { TagSeverity } from './types.js';

export interface NuiTagViewState {
  value: string;
  severity: TagSeverity | '';
  rounded: boolean;
  icon: string;
  nuiType: NuiType;
  tagClass: string;
  lightDomHasContent: boolean;
}

export function resolveSeverity(
  state: Pick<NuiTagViewState, 'severity'>,
): TagSeverity | 'primary' {
  if (state.severity) {
    return state.severity;
  }
  return 'primary';
}

export function getTagClass(tagClass: string): string {
  return ['nui-tag', tagClass].filter(Boolean).join(' ');
}

export function renderTagIcon(icon: string): TemplateResult | typeof nothing {
  if (!icon) {
    return nothing;
  }

  return html`
    <nui-icon
      class="nui-tag-icon"
      icon=${icon}
      aria-hidden="true"
    ></nui-icon>
  `;
}

export function renderTagLabel(
  state: Pick<NuiTagViewState, 'value' | 'lightDomHasContent'>,
): TemplateResult | typeof nothing {
  if (state.lightDomHasContent || !state.value) {
    return nothing;
  }

  return html`<span class="nui-tag-label">${state.value}</span>`;
}

export function renderTag(state: NuiTagViewState): TemplateResult {
  const severity = resolveSeverity(state);
  const showSeverity = Boolean(state.severity);

  return html`
    <span
      class=${getTagClass(state.tagClass)}
      severity=${showSeverity ? severity : nothing}
      nui-type=${state.nuiType || nothing}
      ?rounded=${state.rounded || nothing}
    >
      ${renderTagIcon(state.icon)}
      <slot>${renderTagLabel(state)}</slot>
    </span>
  `;
}
