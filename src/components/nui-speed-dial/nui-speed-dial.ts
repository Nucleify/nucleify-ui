import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  type NuiSpeedDialHandlers,
  type NuiSpeedDialViewState,
  renderSpeedDial,
} from './logic.js';
import type {
  SpeedDialDirection,
  SpeedDialMenuItem,
  SpeedDialType,
} from './types.js';

const styles = createComponentStyles(
  'nui-speed-dial',
  () => import('./styles.css', { with: { type: 'css' } }),
);

let listIdCounter = 0;

@customElement('nui-speed-dial')
export class NuiSpeedDial extends LitElement implements NuiSpeedDialViewState {
  @property({ type: Array }) model: SpeedDialMenuItem[] = [];
  @property({ type: String }) direction: SpeedDialDirection = 'up';
  @property({ type: String }) type: SpeedDialType = 'linear';
  @property({ type: Number }) radius = 0;
  @property({ type: Number, attribute: 'transition-delay' })
  transitionDelay = 30;
  @property({ type: Boolean }) mask = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean, reflect: true }) visible = false;
  @property({ type: Boolean, attribute: 'hide-on-click-outside' })
  hideOnClickOutside = true;
  @property({ type: Boolean, attribute: 'rotate-animation' })
  rotateAnimation = true;
  @property({ type: String, attribute: 'button-class' }) buttonClass = '';
  @property({ type: String, attribute: 'mask-class' }) maskClass = '';
  @property({ type: String, attribute: 'speed-dial-class' })
  speedDialClass = '';
  @property({ type: String, attribute: 'show-icon' }) showIcon = '';
  @property({ type: String, attribute: 'hide-icon' }) hideIcon = '';
  @property({ type: String, attribute: 'aria-label' }) ariaLabel = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';

  @state() open = false;

  readonly listId = `nui-speed-dial-list-${++listIdCounter}`;

  private suppressOutsideClick = false;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('keydown', this.handleDocumentKeyDown);
    if (this.visible) {
      this.open = true;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  protected willUpdate(changed: PropertyValues) {
    if (changed.has('visible')) {
      this.open = this.visible;
    }
  }

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  private handleOutsideClick = (event: MouseEvent) => {
    if (!this.hideOnClickOutside || !this.open || this.suppressOutsideClick) {
      this.suppressOutsideClick = false;
      return;
    }

    if (!event.composedPath().includes(this)) {
      this.close(event);
    }
  };

  private handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.open) {
      this.close(event);
    }
  };

  private setOpen(next: boolean, event?: Event) {
    if (this.disabled || this.open === next) {
      return;
    }

    this.open = next;
    this.visible = next;

    this.dispatchEvent(
      new CustomEvent(next ? 'show' : 'hide', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { visible: next, originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private openMenu(event?: Event) {
    this.setOpen(true, event);
  }

  private close(event?: Event) {
    this.setOpen(false, event);
  }

  private toggle(event: Event) {
    this.suppressOutsideClick = true;

    if (this.open) {
      this.close(event);
    } else {
      this.openMenu(event);
    }

    this.dispatchEvent(
      new CustomEvent('click', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private getVisibleItems(): SpeedDialMenuItem[] {
    return this.model.filter((item) => {
      if (typeof item.visible === 'function') {
        return item.visible();
      }

      return item.visible !== false;
    });
  }

  private focusActionAt(index: number) {
    const buttons = this.renderRoot.querySelectorAll<HTMLButtonElement>(
      '.nui-speed-dial-action:not([disabled])',
    );
    const target = buttons[index];

    if (target) {
      target.focus();
    }
  }

  private handleButtonKeyDown: NuiSpeedDialHandlers['onButtonKeyDown'] = (
    event,
  ) => {
    const items = this.getVisibleItems();

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowLeft':
        event.preventDefault();
        this.openMenu(event);
        this.focusActionAt(items.length - 1);
        break;
      case 'ArrowUp':
      case 'ArrowRight':
        event.preventDefault();
        this.openMenu(event);
        this.focusActionAt(0);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggle(event);
        break;
      default:
        break;
    }
  };

  private handleListKeyDown: NuiSpeedDialHandlers['onListKeyDown'] = (
    event,
  ) => {
    const items = this.getVisibleItems();
    const buttons = [
      ...this.renderRoot.querySelectorAll<HTMLButtonElement>(
        '.nui-speed-dial-action:not([disabled])',
      ),
    ];
    const activeElement = document.activeElement;
    const currentIndex =
      activeElement instanceof HTMLButtonElement
        ? buttons.indexOf(activeElement)
        : -1;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        this.focusActionAt((currentIndex + 1) % buttons.length);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        this.focusActionAt(
          (currentIndex - 1 + buttons.length) % buttons.length,
        );
        break;
      case 'Home':
        event.preventDefault();
        this.focusActionAt(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusActionAt(buttons.length - 1);
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const item = items[currentIndex];
        if (item) {
          this.handleItemClick(item, event as unknown as MouseEvent);
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.close(event);
        this.renderRoot
          .querySelector<HTMLButtonElement>('.nui-speed-dial-button')
          ?.focus();
        break;
      default:
        break;
    }
  };

  private handleItemClick(item: SpeedDialMenuItem, event: MouseEvent) {
    event.stopPropagation();
    this.suppressOutsideClick = true;

    if (item.disabled || this.disabled) {
      return;
    }

    if (item.command) {
      item.command({ originalEvent: event, item });
    }

    this.dispatchEvent(
      new CustomEvent('item-click', {
        detail: { item, originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );

    this.close(event);
  }

  private get _handlers(): NuiSpeedDialHandlers {
    return {
      onToggle: (event) => this.toggle(event),
      onItemClick: (item, event) => this.handleItemClick(item, event),
      onButtonKeyDown: (event) => this.handleButtonKeyDown(event),
      onListKeyDown: (event) => this.handleListKeyDown(event),
    };
  }

  render() {
    return renderSpeedDial(this, this._handlers);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-speed-dial': NuiSpeedDial;
  }
}
