import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';

export interface NuiParagraphViewState {
  text: string;
  nuiType: NuiType;
  paragraphClass: string;
}

export function getParagraphClass(paragraphClass: string): string {
  return ['nui-paragraph', paragraphClass].filter(Boolean).join(' ');
}

export function renderParagraph(state: NuiParagraphViewState): TemplateResult {
  return html`
    <p
      class=${getParagraphClass(state.paragraphClass)}
      nui-type=${state.nuiType || nothing}
    >
      ${state.text || nothing}
      <slot></slot>
    </p>
  `;
}
