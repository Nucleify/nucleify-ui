import '../nui-icon/nui-icon.js';
import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  getScrollParent,
  getWindowScrollTop,
  type NuiScrollTopViewState,
  renderScrollTop,
  shouldShowScrollTop,
} from './logic.js';
import type { ScrollTopBehavior, ScrollTopTarget } from './types.js';

const styles = createComponentStyles(
  'nui-scroll-top',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-scroll-top')
export class NuiScrollTop extends LitElement implements NuiScrollTopViewState {
  @state() visible = false;
  @property({ type: String, reflect: true }) target: ScrollTopTarget = 'window';
  @property({ type: Number, reflect: true }) threshold = 400;
  @property({ type: String }) icon = '';
  @property({ type: String, reflect: true }) behavior:
    | ScrollTopBehavior
    | string = 'smooth';
  @property({ type: Boolean, reflect: true }) rounded = true;
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'scroll-top-class' })
  scrollTopClass = '';
  @property({ type: String, attribute: 'scroll-container' })
  scrollContainer = '';

  private scrollListener: (() => void) | null = null;
  private scrollElement: Window | HTMLElement | null = null;
  private bindAttempts = 0;

  connectedCallback() {
    super.connectedCallback();
    this.scheduleBind();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindScrollListener();
  }

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    this.scheduleBind();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('target') || changed.has('scrollContainer')) {
      this.bindAttempts = 0;
      this.scheduleBind();
    }

    if (changed.has('threshold')) {
      this.updateVisibility();
    }
  }

  private scheduleBind(): void {
    requestAnimationFrame(() => {
      this.bindScrollListener();
      this.updateVisibility();
    });
  }

  private getScrollElement(): Window | HTMLElement | null {
    return getScrollParent(this, this.target, this.scrollContainer);
  }

  private getCurrentScrollTop(): number {
    const element = this.getScrollElement();

    if (element === window) {
      return getWindowScrollTop();
    }

    if (element instanceof HTMLElement) {
      return element.scrollTop;
    }

    return 0;
  }

  private updateVisibility(): void {
    const nextVisible = shouldShowScrollTop(
      this.getCurrentScrollTop(),
      this.threshold,
    );

    if (this.visible !== nextVisible) {
      this.visible = nextVisible;
    }
  }

  private bindScrollListener(): void {
    this.unbindScrollListener();

    const element = this.getScrollElement();

    if (!element) {
      if (this.target === 'parent' && this.bindAttempts < 5) {
        this.bindAttempts += 1;
        this.scheduleBind();
      }

      return;
    }

    this.bindAttempts = 0;
    this.scrollElement = element;
    this.scrollListener = () => this.updateVisibility();

    if (element === window) {
      window.addEventListener('scroll', this.scrollListener, { passive: true });
      this.updateVisibility();
      return;
    }

    element.addEventListener('scroll', this.scrollListener, { passive: true });
    this.updateVisibility();
  }

  private unbindScrollListener(): void {
    if (!this.scrollListener || !this.scrollElement) {
      this.scrollListener = null;
      this.scrollElement = null;
      return;
    }

    if (this.scrollElement === window) {
      window.removeEventListener('scroll', this.scrollListener);
    } else {
      this.scrollElement.removeEventListener('scroll', this.scrollListener);
    }

    this.scrollListener = null;
    this.scrollElement = null;
  }

  private handleClick = (): void => {
    const element = this.getScrollElement();

    if (!element) {
      return;
    }

    if (element === window) {
      window.scrollTo({
        top: 0,
        behavior: this.behavior as ScrollBehavior,
      });
      return;
    }

    element.scrollTo({
      top: 0,
      behavior: this.behavior as ScrollBehavior,
    });
  };

  render() {
    return renderScrollTop(this, this.handleClick);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-scroll-top': NuiScrollTop;
  }
}
