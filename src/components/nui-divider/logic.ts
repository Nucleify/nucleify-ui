import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { DividerAlign, DividerLayout, DividerType } from './types.js';

export interface NuiDividerViewState {
  layout: DividerLayout | '';
  align: DividerAlign | '';
  type: DividerType | '';
  nuiType: NuiType;
  dividerClass: string;
  lightDomHasContent: boolean;
}

export function resolveLayout(layout: DividerLayout | ''): DividerLayout {
  return layout || 'horizontal';
}

export function resolveType(type: DividerType | ''): DividerType {
  return type || 'solid';
}

export function resolveAlign(
  state: Pick<NuiDividerViewState, 'layout' | 'align'>,
): DividerAlign | '' {
  if (state.align) {
    return state.align;
  }

  return 'center';
}

export function getDividerClass(dividerClass: string): string {
  return ['nui-divider', dividerClass].filter(Boolean).join(' ');
}

export function renderDivider(state: NuiDividerViewState): TemplateResult {
  const layout = resolveLayout(state.layout);
  const type = resolveType(state.type);
  const align = state.lightDomHasContent ? resolveAlign(state) : '';
  const showLayout = layout !== 'horizontal';
  const showType = type !== 'solid';
  const showAlign = Boolean(align) && align !== 'center';

  return html`
    <div
      class=${getDividerClass(state.dividerClass)}
      role="separator"
      aria-orientation=${layout}
      layout=${showLayout ? layout : nothing}
      type=${showType ? type : nothing}
      align=${showAlign ? align : nothing}
      nui-type=${state.nuiType || nothing}
      ?content=${state.lightDomHasContent || nothing}
    >
      <span class="nui-divider-content">
        <slot></slot>
      </span>
    </div>
  `;
}
