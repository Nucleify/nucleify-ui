import '../nui-heading/nui-heading.js';
import { html, nothing, type TemplateResult } from 'lit';
import type { NuiTabsViewState } from './types.js';

export type { NuiTabsViewState } from './types.js';

export interface NuiTabsHandlers {
  onTabClick: (value: string | number) => void;
  onTabKeydown: (event: KeyboardEvent, index: number) => void;
}

export function renderTabs(
  state: NuiTabsViewState,
  handlers: NuiTabsHandlers,
): TemplateResult {
  const lists = state.lists || [];
  const panels = state.panels || [];

  return html`
    <div class="nui-tabs" part="root" nui-type=${state.nuiType || nothing}>
      <div class="nui-tablist" part="tablist" role="tablist">
        ${lists.map((list, index) => {
          const isActive = list.value === state.activeValue;
          return html`<button
            type="button"
            class="nui-tab"
            part="tab"
            role="tab"
            tabindex=${isActive ? 0 : -1}
            ?active=${isActive}
            aria-selected=${isActive ? 'true' : 'false'}
            @click=${() => handlers.onTabClick(list.value)}
            @keydown=${(e: KeyboardEvent) => handlers.onTabKeydown(e, index)}
          ><nui-heading
            tag="4"
            text=${list.header || ''}
            unstyled
          ></nui-heading></button>`;
        })}
      </div>
      <div class="nui-tabpanels" part="tabpanels">
        ${panels.map((panel) => {
          const isHidden = panel.value !== state.activeValue;
          return html`
            <div
              class="nui-tabpanel"
              part="panel"
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
