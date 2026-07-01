import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiDockViewState, renderDock } from './logic.js';
import type { DockItem, DockPosition } from './types.js';

const styles = createComponentStyles(
  'nui-dock',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-dock')
export class NuiDock extends LitElement implements NuiDockViewState {
  @property({ type: Array }) model: DockItem[] = [];
  @property({ type: String, reflect: true }) position: DockPosition = 'bottom';
  @property({ type: Boolean }) unstyled = false;
  @property({ type: String, attribute: 'dock-class' }) dockClass = '';
  @property({ type: String, attribute: 'dock-style' }) dockStyle = '';
  @nuiTypeProperty nuiType: NuiType = '';

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  private handleItemClick(item: DockItem, event: MouseEvent) {
    if (item.click) {
      item.click(event);
    }
    this.dispatchEvent(
      new CustomEvent('item-click', {
        detail: { item, originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return renderDock(this, {
      onItemClick: (item, event) => this.handleItemClick(item, event),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-dock': NuiDock;
  }
}
