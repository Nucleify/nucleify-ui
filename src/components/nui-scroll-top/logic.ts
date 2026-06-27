import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { ScrollTopBehavior, ScrollTopTarget } from './types.js';

export const DEFAULT_SCROLL_TOP_ICON = 'mdi:chevron-up';

export interface NuiScrollTopViewState {
  visible: boolean;
  target: ScrollTopTarget;
  threshold: number;
  icon: string;
  behavior: ScrollTopBehavior | string;
  rounded: boolean;
  nuiType: NuiType;
  scrollTopClass: string;
  scrollContainer: string;
}

export function getScrollTopClass(scrollTopClass: string): string {
  return ['nui-scroll-top', scrollTopClass].filter(Boolean).join(' ');
}

export function getWindowScrollTop(): number {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

export function shouldShowScrollTop(
  scrollTop: number,
  threshold: number,
): boolean {
  const safeThreshold = Number.isFinite(threshold) ? threshold : 400;

  return scrollTop > safeThreshold;
}

export function getScrollParent(
  element: HTMLElement,
  target: ScrollTopTarget,
  scrollContainer = '',
): Window | HTMLElement | null {
  if (target === 'window') {
    return window;
  }

  const hostParent = element.parentElement;

  if (!hostParent) {
    return null;
  }

  const selector = scrollContainer.trim();

  if (selector) {
    const container = hostParent.querySelector(selector);

    if (container instanceof HTMLElement) {
      return container;
    }
  }

  return hostParent;
}

export function getScrollTopIcon(icon: string): string {
  return icon.trim() || DEFAULT_SCROLL_TOP_ICON;
}

export function renderScrollTop(
  state: NuiScrollTopViewState,
  onClick: () => void,
): TemplateResult | typeof nothing {
  if (!state.visible) {
    return nothing;
  }

  return html`
    <button
      type="button"
      class=${getScrollTopClass(state.scrollTopClass)}
      nui-type=${state.nuiType || nothing}
      ?rounded=${state.rounded || nothing}
      aria-label="Scroll to top"
      @click=${onClick}
    >
      <slot>
        <nui-icon
          class="nui-scroll-top-icon"
          icon=${getScrollTopIcon(state.icon)}
          width="1.25rem"
          height="1.25rem"
          aria-hidden="true"
        ></nui-icon>
      </slot>
    </button>
  `;
}
