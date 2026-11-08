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
  @property({ type: Boolean }) multiple = false;
  @nuiTypeProperty nuiType: NuiType = '';

  @state() messages: ToastMessage[] = [];

  private _messageTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private _pendingShowTimer: ReturnType<typeof setTimeout> | null = null;
  private _pendingShowToken = 0;

  private _globalAddHandler = (e: Event) => {
    const customEvent = e as CustomEvent<ToastMessage>;
    if (customEvent.detail) {
      this.add(customEvent.detail);
    }
  };

  private _globalClearHandler = () => {
    this.clear();
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('nui-toast-add', this._globalAddHandler);
    window.addEventListener('nui-toast-clear', this._globalClearHandler);
  }

  disconnectedCallback() {
    window.removeEventListener('nui-toast-add', this._globalAddHandler);
    window.removeEventListener('nui-toast-clear', this._globalClearHandler);
    this.clear();
    super.disconnectedCallback();
  }

  protected createRenderRoot() {
    const root = super.createRenderRoot();
    void styles.sync(root, { unstyled: this.unstyled });
    return root;
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  public clear() {
    if (this._pendingShowTimer) {
      clearTimeout(this._pendingShowTimer);
      this._pendingShowTimer = null;
    }
    this._pendingShowToken++;
    for (const timer of this._messageTimers.values()) {
      clearTimeout(timer);
    }
    this._messageTimers.clear();
    this.messages = [];
  }

  public add(message: ToastMessage) {
    if (this.multiple) {
      this._appendMessage(message);
      return;
    }

    // Single mode: dismiss any existing toast before showing the new one
    if (this.messages.length > 0) {
      // Trigger closing animation on existing messages
      this.messages = this.messages.map((m) => ({ ...m, closing: true }));

      // Clear existing auto-dismiss timers since dismissal is active now
      for (const timer of this._messageTimers.values()) {
        clearTimeout(timer);
      }
      this._messageTimers.clear();

      if (this._pendingShowTimer) {
        clearTimeout(this._pendingShowTimer);
        this._pendingShowTimer = null;
      }

      const token = ++this._pendingShowToken;
      // Wait for CSS toast-fade-out (200ms) so old toast completely vanishes first
      this._pendingShowTimer = setTimeout(() => {
        if (token !== this._pendingShowToken) return;
        this._pendingShowTimer = null;
        this.messages = [];
        this._appendMessage(message);
      }, 200);
      return;
    }

    // No existing messages, show immediately
    this._appendMessage(message);
  }

  private _appendMessage(message: ToastMessage) {
    const id =
      message.id || `toast-${Math.random().toString(36).substring(2, 9)}`;
    const life = message.life !== undefined ? message.life : 3000;
    const newMessage = { ...message, id, closing: false };

    this.messages = this.multiple
      ? [...this.messages, newMessage]
      : [newMessage];

    if (life > 0) {
      const timer = setTimeout(() => {
        this.dismiss(id);
      }, life);
      this._messageTimers.set(id, timer);
    }
  }

  public dismiss(id: string) {
    const timer = this._messageTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this._messageTimers.delete(id);
    }

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
