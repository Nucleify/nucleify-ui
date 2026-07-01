import { LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import { createComponentStyles } from '../../utils/sync-stylesheet.js';
import { type NuiPopoverViewState, renderPopover } from './logic.js';

const styles = createComponentStyles(
  'nui-popover',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-popover')
export class NuiPopover extends LitElement implements NuiPopoverViewState {
  @property({ type: String, attribute: 'button-text' }) buttonText = '';
  @property({ type: String }) icon = '';
  @property({ type: String }) src = '';
  @property({ type: String, attribute: 'button-class' }) buttonClass = '';
  @property({ type: String, attribute: 'button-style' }) buttonStyle = '';
  @property({ type: String, attribute: 'popover-class' }) popoverClass = '';
  @property({ type: String }) position: 'top' | 'bottom' | 'left' | 'right' =
    'bottom';
  @nuiTypeProperty nuiType: NuiType = '';

  @state() open = false;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('click', this.handleOutsideClick);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('click', this.handleOutsideClick);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  protected firstUpdated() {
    void styles.sync(this.renderRoot);
  }

  toggle = () => {
    this.open = !this.open;
  };

  show = () => {
    this.open = true;
  };

  hide = () => {
    this.open = false;
  };

  private handleOutsideClick = (event: MouseEvent) => {
    if (!this.open) {
      return;
    }
    const path = event.composedPath();
    if (!path.includes(this)) {
      this.open = false;
    }
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.open) {
      this.open = false;
    }
  };

  render() {
    return renderPopover(this, {
      onToggle: this.toggle,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-popover': NuiPopover;
  }
}
