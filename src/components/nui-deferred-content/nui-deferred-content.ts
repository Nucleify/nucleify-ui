import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  getObserverRoot,
  type NuiDeferredContentViewState,
  renderDeferredContent,
} from './logic.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-deferred-content')
export class NuiDeferredContent
  extends LitElement
  implements NuiDeferredContentViewState
{
  @state() loaded = false;
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'deferred-content-class' })
  deferredContentClass = '';
  @property({ type: String, attribute: 'scroll-container' })
  scrollContainer = '';

  @query('.nui-deferred-content') private sentinel!: HTMLElement;

  private observer: IntersectionObserver | null = null;
  private bindAttempts = 0;

  connectedCallback() {
    super.connectedCallback();
    this.scheduleObserve();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.disconnectObserver();
  }

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    this.scheduleObserve();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('scrollContainer') && !this.loaded) {
      this.bindAttempts = 0;
      this.scheduleObserve();
    }
  }

  private scheduleObserve(): void {
    if (this.loaded) {
      return;
    }

    requestAnimationFrame(() => {
      this.observeVisibility();
    });
  }

  private observeVisibility(): void {
    this.disconnectObserver();

    if (this.loaded || !this.sentinel) {
      return;
    }

    const root = getObserverRoot(this, this.scrollContainer);

    if (this.scrollContainer.trim() && !root) {
      if (this.bindAttempts < 5) {
        this.bindAttempts += 1;
        this.scheduleObserve();
      }

      return;
    }

    this.bindAttempts = 0;
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.load(entry);
            break;
          }
        }
      },
      { root, threshold: 0 },
    );

    this.observer.observe(this.sentinel);
  }

  private load(event?: IntersectionObserverEntry): void {
    if (this.loaded) {
      return;
    }

    this.loaded = true;
    this.disconnectObserver();

    this.dispatchEvent(
      new CustomEvent('load', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private disconnectObserver(): void {
    if (!this.observer) {
      return;
    }

    this.observer.disconnect();
    this.observer = null;
  }

  render() {
    return renderDeferredContent(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-deferred-content': NuiDeferredContent;
  }
}
