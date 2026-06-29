import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { MenuItem } from './types.js';

export interface NuiMenuViewProps {
  model: MenuItem[];
  popup: boolean;
  disabled: boolean;
  menuClass: string;
  nuiType: NuiType;
  overlayVisible: boolean;
}

export interface MenuRenderHandlers {
  onItemClick: (item: MenuItem, event: Event) => void;
}

function renderItem(
  item: MenuItem,
  handler: (item: MenuItem, event: Event) => void,
): TemplateResult {
  if (item.visible === false) {
    return html`${nothing}`;
  }

  if (item.separator) {
    return html`
      <li class="nui-menu-separator" role="separator"></li>
    `;
  }

  const hasIcon = !!item.icon;
  const linkContent = html`
    ${hasIcon ? html`<nui-icon class="nui-menu-item-icon" .icon=${item.icon}></nui-icon>` : nothing}
    <span class="nui-menu-item-label">${item.label}</span>
  `;

  const handleClick = (e: Event) => {
    if (item.disabled) {
      e.preventDefault();
      return;
    }
    handler(item, e);
  };

  return html`
    <li class="nui-menu-item" ?disabled=${item.disabled || nothing} role="none">
      ${
        item.url
          ? html`
            <a
              class="nui-menu-item-link"
              href=${item.url}
              target=${item.target || '_self'}
              @click=${handleClick}
              role="menuitem"
              aria-disabled=${item.disabled ? 'true' : 'false'}
            >
              ${linkContent}
            </a>
          `
          : html`
            <button
              class="nui-menu-item-link"
              type="button"
              @click=${handleClick}
              role="menuitem"
              ?disabled=${item.disabled || nothing}
            >
              ${linkContent}
            </button>
          `
      }
    </li>
  `;
}

export function renderMenu(
  state: NuiMenuViewProps,
  handlers: MenuRenderHandlers,
): TemplateResult {
  const isHidden = state.popup && !state.overlayVisible;

  return html`
    <div
      class=${['nui-menu', state.popup ? 'nui-menu-overlay' : '', state.menuClass].filter(Boolean).join(' ')}
      nui-type=${state.nuiType || nothing}
      ?popup=${state.popup || nothing}
      ?hidden=${isHidden || nothing}
      role="menu"
    >
      <ul class="nui-menu-list">
        ${state.model.map((item) => renderItem(item, handlers.onItemClick))}
      </ul>
    </div>
  `;
}
