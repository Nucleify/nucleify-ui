import { html, nothing, type TemplateResult } from 'lit';
import type { NuiTabsViewState } from './types.js';

export interface NuiTabsHandlers {
  onTabClick: (value: string | number) => void;
}

export function renderTabs(
  state: NuiTabsViewState,
  handlers: NuiTabsHandlers,
): TemplateResult {
  const lists = state.lists || [];
  const panels = state.panels || [];

  return html`
    <div class="nui-tabs" nui-type=${state.nuiType || nothing}>
      <div class="nui-tablist" role="tablist">
        ${lists.map((list) => {
          const isActive = list.value === state.activeValue;
          return html`<button
            type="button"
            class="nui-tab"
            role="tab"
            ?active=${isActive}
            aria-selected=${isActive ? 'true' : 'false'}
            @click=${() => handlers.onTabClick(list.value)}
          ><h4>${list.header || ''}</h4></button>`;
        })}
      </div>
      <div class="nui-tabpanels">
        ${panels.map((panel) => {
          const isHidden = panel.value !== state.activeValue;
          return html`
            <div
              class="nui-tabpanel"
              role="tabpanel"
              ?hidden=${isHidden}
              aria-hidden=${isHidden ? 'true' : 'false'}
            >
              <p>${panel.content || ''}</p>
            </div>
          `;
        })}
        <slot></slot>
      </div>
    </div>
  `;
}
