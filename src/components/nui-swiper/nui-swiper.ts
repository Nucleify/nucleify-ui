import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  type NuiSwiperHandlers,
  type NuiSwiperViewState,
  renderSwiper,
} from './logic.js';
import type { SwiperProps, SwiperSlideInterface } from './types.js';

const styles = createComponentStyles(
  'nui-swiper',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-swiper')
export class NuiSwiper extends LitElement implements SwiperProps {
  @property({ type: Array }) slides?: SwiperSlideInterface[] = [];
  @property({ type: Number, attribute: 'slides-per-view' }) slidesPerView = 1;
  @property({ type: Number, attribute: 'slides-per-group' }) slidesPerGroup = 1;
  @property({ type: Number, attribute: 'space-between' }) spaceBetween = 0;
  @property({ type: Number }) speed = 300;
  @property({ type: Boolean }) navigation = false;
  @property({ type: Boolean }) pagination = false;
  @property({ type: Boolean }) loop = false;
  @property({ type: Boolean }) autoplay = false;
  @property({ type: Number, attribute: 'autoplay-delay' }) autoplayDelay = 3000;
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';

  @state() currentIndex = 0;
  @state() totalSlides = 0;

  private autoplayTimer?: number;
  private touchStartX = 0;
  private touchCurrentX = 0;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('touchstart', this.handleTouchStart, {
      passive: true,
    });
    this.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    this.addEventListener('touchend', this.handleTouchEnd);
    this.startAutoplay();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('touchstart', this.handleTouchStart);
    this.removeEventListener('touchmove', this.handleTouchMove);
    this.removeEventListener('touchend', this.handleTouchEnd);
    this.stopAutoplay();
  }

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    this.updateTotalSlides();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('autoplay') || changed.has('autoplayDelay')) {
      this.stopAutoplay();
      this.startAutoplay();
    }

    if (changed.has('slides')) {
      this.updateTotalSlides();
    }

    if (changed.has('slidesPerView') || changed.has('spaceBetween')) {
      this.updateCssVariables();
    }
  }

  private updateCssVariables() {
    this.style.setProperty(
      '--nui-swiper-slides-per-view',
      String(this.slidesPerView),
    );
    this.style.setProperty(
      '--nui-swiper-space-between',
      `${this.spaceBetween}px`,
    );
  }

  private updateTotalSlides() {
    const propSlidesCount = this.slides?.length || 0;
    const slotSlidesCount = this.getSlottedElements().length;
    this.totalSlides = propSlidesCount + slotSlidesCount;
    this.currentIndex = Math.max(
      0,
      Math.min(this.currentIndex, this.totalSlides - this.slidesPerView),
    );
  }

  private getSlottedElements(): Element[] {
    const slot = this.renderRoot?.querySelector('slot');
    return slot ? slot.assignedElements() : [];
  }

  private startAutoplay() {
    if (!this.autoplay) return;
    this.autoplayTimer = window.setInterval(() => {
      this.next();
    }, this.autoplayDelay);
  }

  private stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }

  prev() {
    const step = this.slidesPerGroup;
    if (this.currentIndex > 0) {
      this.currentIndex = Math.max(0, this.currentIndex - step);
    } else if (this.loop) {
      this.currentIndex = Math.max(0, this.totalSlides - this.slidesPerView);
    }
    this.emitChange();
  }

  next() {
    const step = this.slidesPerGroup;
    const maxIndex = this.totalSlides - this.slidesPerView;
    if (this.currentIndex < maxIndex) {
      this.currentIndex = Math.min(maxIndex, this.currentIndex + step);
    } else if (this.loop) {
      this.currentIndex = 0;
    }
    this.emitChange();
  }

  goTo(index: number) {
    const maxIndex = this.totalSlides - this.slidesPerView;
    this.currentIndex = Math.max(0, Math.min(index, maxIndex));
    this.emitChange();
  }

  private emitChange() {
    this.dispatchEvent(
      new CustomEvent('nui-change', {
        detail: {
          index: this.currentIndex,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleTouchStart = (e: TouchEvent) => {
    this.touchStartX = e.touches[0].clientX;
    this.touchCurrentX = this.touchStartX;
  };

  private handleTouchMove = (e: TouchEvent) => {
    this.touchCurrentX = e.touches[0].clientX;
  };

  private handleTouchEnd = () => {
    const diff = this.touchStartX - this.touchCurrentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  };

  private get _handlers(): NuiSwiperHandlers {
    return {
      onPrev: () => this.prev(),
      onNext: () => this.next(),
      onGoTo: (index: number) => this.goTo(index),
      onSlotChange: () => this.updateTotalSlides(),
    };
  }

  render() {
    const wrapperStyle: Record<string, string> = {
      transform: `translateX(calc(-1 * ${this.currentIndex} * (100% + ${this.spaceBetween}px) / ${this.slidesPerView}))`,
      transition: `transform ${this.speed}ms ease`,
    };

    const slideStyle: Record<string, string> = {};

    const viewState: NuiSwiperViewState = {
      slides: this.slides,
      slidesPerView: this.slidesPerView,
      slidesPerGroup: this.slidesPerGroup,
      spaceBetween: this.spaceBetween,
      speed: this.speed,
      navigation: this.navigation,
      pagination: this.pagination,
      loop: this.loop,
      autoplay: this.autoplay,
      autoplayDelay: this.autoplayDelay,
      unstyled: this.unstyled,
      nuiType: this.nuiType,
      currentIndex: this.currentIndex,
      totalSlides: this.totalSlides,
      wrapperStyle,
      slideStyle,
    };

    return renderSwiper(viewState, this._handlers);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-swiper': NuiSwiper;
  }
}
