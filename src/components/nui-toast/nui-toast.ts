import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  type NuiToastHandlers,
  type NuiToastViewState,
  renderToast,
} from './logic.js';
import type { ToastMessage, ToastPosition, ToastProps } from './types.js';

const styles = createComponentStyles(
  'nui-toast',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-toast')
export class NuiToast extends LitElement implements ToastProps {
  @property({ type: String, reflect: true }) position: ToastPosition =
    'top-right';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';

  @state() messages: ToastMessage[] = [];

  private _globalAddHandler = (e: Event) => {
    const customEvent = e as CustomEvent<ToastMessage>;
    if (customEvent.detail) {
      this.add(customEvent.detail);
    }
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('nui-toast-add', this._globalAddHandler);
  }

  disconnectedCallback() {
    window.removeEventListener('nui-toast-add', this._globalAddHandler);
    super.disconnectedCallback();
  }

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  public add(message: ToastMessage) {
    const id =
      message.id || `toast-${Math.random().toString(36).substring(2, 9)}`;
    const life = message.life !== undefined ? message.life : 3000;
    const newMessage = { ...message, id, closing: false };

    this.messages = [...this.messages, newMessage];

    if (life > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, life);
    }
  }

  public dismiss(id: string) {
    this.messages = this.messages.map((m) => {
      if (m.id === id) {
        return { ...m, closing: true };
      }
      return m;
    });

    setTimeout(() => {
      this.messages = this.messages.filter((m) => m.id !== id);
    }, 200); // Matches CSS toast-fade-out duration
  }

  private get _handlers(): NuiToastHandlers {
    return {
      onCloseClick: (id) => this.dismiss(id),
    };
  }

  render() {
    const viewState: NuiToastViewState = {
      position: this.position,
      unstyled: this.unstyled,
      nuiType: this.nuiType,
      messages: this.messages,
    };

    return renderToast(viewState, this._handlers);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-toast': NuiToast;
  }
}
