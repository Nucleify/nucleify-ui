import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiMenuViewProps, renderMenu } from './logic.js';
import type { MenuItem } from './types.js';

const styles = createComponentStyles(
  'nui-menu',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-menu')
export class NuiMenu extends LitElement implements NuiMenuViewProps {
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  model: MenuItem[] = [];

  @property({ type: Boolean, reflect: true }) popup = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'menu-class' }) menuClass = '';

  @state() overlayVisible = false;

  private triggerElement: HTMLElement | null = null;

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindListeners();
  }

  toggle(event: Event): void {
    if (this.disabled) return;
    if (this.overlayVisible) {
      this.hide();
    } else {
      const trigger = event.currentTarget || event.target;
      if (trigger instanceof HTMLElement) {
        this.show(trigger);
      }
    }
  }

  show(trigger: HTMLElement): void {
    if (this.disabled || this.overlayVisible) return;
    this.triggerElement = trigger;
    this.overlayVisible = true;

    this.dispatchEvent(
      new CustomEvent('show', {
        bubbles: true,
        composed: true,
      }),
    );

    this.bindListeners();
    void this.updatePosition();
  }

  hide(): void {
    if (!this.overlayVisible) return;
    this.overlayVisible = false;
    this.triggerElement = null;

    this.dispatchEvent(
      new CustomEvent('hide', {
        bubbles: true,
        composed: true,
      }),
    );

    this.unbindListeners();
  }

  private async updatePosition(): Promise<void> {
    if (!this.overlayVisible || !this.triggerElement || !this.popup) return;
    await this.updateComplete;

    const overlay = this.renderRoot.querySelector(
      '.nui-menu-overlay',
    ) as HTMLElement;
    if (!overlay) return;

    const triggerRect = this.triggerElement.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();

    let top = triggerRect.bottom;
    let left = triggerRect.left;

    // Boundary checks (viewport overflow)
    if (left + overlayRect.width > window.innerWidth) {
      left = triggerRect.right - overlayRect.width;
    }
    if (left < 0) {
      left = 0;
    }
    if (top + overlayRect.height > window.innerHeight) {
      top = triggerRect.top - overlayRect.height;
    }
    if (top < 0) {
      top = 0;
    }

    overlay.style.top = `${top}px`;
    overlay.style.left = `${left}px`;
  }

  private handleOutsideClick = (event: MouseEvent): void => {
    const path = event.composedPath();
    if (
      path.includes(this) ||
      (this.triggerElement && path.includes(this.triggerElement))
    ) {
      return;
    }
    this.hide();
  };

  private handleWindowScroll = (): void => {
    this.hide();
  };

  private handleWindowResize = (): void => {
    this.hide();
  };

  private handleEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.hide();
    }
  };

  private bindListeners(): void {
    document.addEventListener('mousedown', this.handleOutsideClick);
    window.addEventListener('scroll', this.handleWindowScroll, {
      passive: true,
    });
    window.addEventListener('resize', this.handleWindowResize);
    document.addEventListener('keydown', this.handleEscape);
  }

  private unbindListeners(): void {
    document.removeEventListener('mousedown', this.handleOutsideClick);
    window.removeEventListener('scroll', this.handleWindowScroll);
    window.removeEventListener('resize', this.handleWindowResize);
    document.removeEventListener('keydown', this.handleEscape);
  }

  private handleItemClick = (item: MenuItem, event: Event): void => {
    if (item.disabled) return;

    item.command?.({ originalEvent: event, item });

    this.dispatchEvent(
      new CustomEvent('select', {
        detail: { item, originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );

    if (this.popup) {
      this.hide();
    }
  };

  render() {
    return renderMenu(this, {
      onItemClick: this.handleItemClick,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-menu': NuiMenu;
  }
}
