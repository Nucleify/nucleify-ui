import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { DockItem, DockPosition } from './types.js';

export interface NuiDockViewState {
  model: DockItem[];
  position: DockPosition;
  unstyled: boolean;
  dockClass: string;
  dockStyle: string;
  nuiType: NuiType;
}

export interface DockRenderHandlers {
  onItemClick: (item: DockItem, event: MouseEvent) => void;
}

export function getDockClass(state: NuiDockViewState): string {
  const classes = ['nui-dock', `nui-dock-${state.position}`];
  if (state.dockClass) {
    classes.push(state.dockClass);
  }
  return classes.filter(Boolean).join(' ');
}

function renderItem(
  _state: NuiDockViewState,
  item: DockItem,
  _index: number,
  handlers: DockRenderHandlers,
): TemplateResult {
  const itemClass = ['nui-dock-item', item.class].filter(Boolean).join(' ');

  return html`
    <li
      class=${itemClass}
      role="none"
      ?logo=${item.logo || nothing}
    >
      <a
        class="nui-dock-item-link"
        role="menuitem"
        href=${item.url || 'javascript:void(0)'}
        title=${item.label || nothing}
        @click=${(e: MouseEvent) => handlers.onItemClick(item, e)}
      >
        ${
          item.icon
            ? html`
              <nui-icon
                icon=${item.icon}
                width="24px"
                height="24px"
                aria-hidden="true"
              ></nui-icon>
            `
            : html`<span>${item.label || ''}</span>`
        }
      </a>
    </li>
  `;
}

export function renderDock(
  state: NuiDockViewState,
  handlers: DockRenderHandlers,
): TemplateResult {
  const orientation =
    state.position === 'left' || state.position === 'right'
      ? 'vertical'
      : 'horizontal';

  return html`
    <div
      class=${getDockClass(state)}
      style=${state.dockStyle || nothing}
      nui-type=${state.nuiType || nothing}
      position=${state.position}
    >
      <div class="nui-dock-list-container">
        <ul
          class="nui-dock-list"
          role="menu"
          aria-orientation=${orientation}
        >
          ${
            state.model && state.model.length > 0
              ? state.model.map((item, index) =>
                  renderItem(state, item, index, handlers),
                )
              : nothing
          }
          <slot></slot>
        </ul>
      </div>
    </div>
  `;
}
