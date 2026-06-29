import { html, nothing, type TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import type { NuiType } from '../../types/nui-type.js';
import type { SwiperProps, SwiperSlideInterface } from './types.js';

export interface NuiSwiperViewState extends SwiperProps {
  currentIndex: number;
  totalSlides: number;
  wrapperStyle: Record<string, string>;
  slideStyle: Record<string, string>;
}

export interface NuiSwiperHandlers {
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
  onSlotChange: (event: Event) => void;
}

function renderSlides(
  slides: SwiperSlideInterface[] | undefined,
  slideStyle: Record<string, string>,
  nuiType: NuiType,
): TemplateResult | typeof nothing {
  if (!slides || slides.length === 0) {
    return nothing;
  }

  return html`
    ${slides.map((slide) => {
      const src = (slide.prefix || '') + (slide.image || '');
      return html`
        <div class="nui-swiper-slide" style=${styleMap(slideStyle)}>
          ${
            slide.url
              ? html`
                <nui-anchor
                  href=${slide.url}
                  src=${src}
                  nui-type=${nuiType || nothing}
                ></nui-anchor>
              `
              : html`<nui-image src=${src}></nui-image>`
          }
        </div>
      `;
    })}
  `;
}

function renderNavigation(
  show: boolean | undefined,
  handlers: NuiSwiperHandlers,
  currentIndex: number,
  totalSlides: number,
  loop: boolean | undefined,
  slidesPerView: number,
): TemplateResult | typeof nothing {
  if (!show || totalSlides <= slidesPerView) {
    return nothing;
  }

  const hasPrev = loop || currentIndex > 0;
  const hasNext = loop || currentIndex < totalSlides - slidesPerView;

  return html`
    <button
      type="button"
      class="nui-swiper-button nui-swiper-button-prev"
      ?disabled=${!hasPrev}
      @click=${handlers.onPrev}
      aria-label="Previous slide"
    ><nui-icon icon="mdi:chevron-left" aria-hidden="true"></nui-icon></button>
    <button
      type="button"
      class="nui-swiper-button nui-swiper-button-next"
      ?disabled=${!hasNext}
      @click=${handlers.onNext}
      aria-label="Next slide"
    ><nui-icon icon="mdi:chevron-right" aria-hidden="true"></nui-icon></button>
  `;
}

function renderPagination(
  show: boolean | undefined,
  totalSlides: number,
  currentIndex: number,
  handlers: NuiSwiperHandlers,
  slidesPerView: number,
): TemplateResult | typeof nothing {
  if (!show || totalSlides <= slidesPerView) {
    return nothing;
  }

  const dotsCount = totalSlides - slidesPerView + 1;
  if (dotsCount <= 1) {
    return nothing;
  }

  const dots = Array.from({ length: dotsCount }, (_, i) => i);

  return html`
    <ul class="nui-swiper-pagination" role="tablist">
      ${dots.map((index) => {
        const active = index === currentIndex;
        return html`
          <li role="presentation">
            <button
              type="button"
              class="nui-swiper-pagination-bullet ${active ? 'nui-swiper-pagination-bullet-active' : ''}"
              role="tab"
              aria-selected=${active ? 'true' : 'false'}
              aria-label=${`Go to slide ${index + 1}`}
              @click=${() => handlers.onGoTo(index)}
            ></button>
          </li>
        `;
      })}
    </ul>
  `;
}

export function renderSwiper(
  state: NuiSwiperViewState,
  handlers: NuiSwiperHandlers,
): TemplateResult {
  const slidesPerView = state.slidesPerView ?? 1;

  return html`
    <div class="nui-swiper-container" nui-type=${state.nuiType || nothing}>
      <div
        class="nui-swiper-wrapper"
        style=${styleMap(state.wrapperStyle)}
      >
        ${renderSlides(state.slides, state.slideStyle, state.nuiType || '')}
        <slot @slotchange=${handlers.onSlotChange}></slot>
      </div>

      ${renderNavigation(
        state.navigation,
        handlers,
        state.currentIndex,
        state.totalSlides,
        state.loop,
        slidesPerView,
      )}
      ${renderPagination(
        state.pagination,
        state.totalSlides,
        state.currentIndex,
        handlers,
        slidesPerView,
      )}
    </div>
  `;
}
