import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';

export interface NuiScrollPanelViewState {
  unstyled: boolean;
  scrollPanelClass: string;
  nuiType: NuiType;
}

export function renderScrollPanel(
  state: NuiScrollPanelViewState,
): TemplateResult {
  const getContainerClass = () => {
    return ['nui-scroll-panel', state.scrollPanelClass]
      .filter(Boolean)
      .join(' ');
  };

  return html`
    <div
      class=${getContainerClass()}
      nui-type=${state.nuiType || nothing}
      style="position:relative;width:100%;height:100%;display:flex;flex-direction:column;min-height:0;"
    >
      <div
        class="nui-scroll-panel-content"
        style="flex:1;min-height:0;width:100%;overflow:auto;box-sizing:border-box;"
      >
        <slot></slot>
      </div>
    </div>
  `;
}
