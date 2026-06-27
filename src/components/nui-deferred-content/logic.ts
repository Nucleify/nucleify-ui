import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';

export interface NuiDeferredContentViewState {
  loaded: boolean;
  nuiType: NuiType;
  deferredContentClass: string;
}

export function getDeferredContentClass(deferredContentClass: string): string {
  return ['nui-deferred-content', deferredContentClass]
    .filter(Boolean)
    .join(' ');
}

export function getObserverRoot(
  element: HTMLElement,
  scrollContainer: string,
): Element | null {
  const selector = scrollContainer.trim();

  if (!selector) {
    return null;
  }

  const fromSelf = element.closest(selector);

  if (fromSelf instanceof HTMLElement) {
    return fromSelf;
  }

  const hostParent = element.parentElement;

  if (!hostParent) {
    return null;
  }

  const container = hostParent.querySelector(selector);

  return container instanceof HTMLElement ? container : null;
}

export function renderDeferredContent(
  state: NuiDeferredContentViewState,
): TemplateResult {
  return html`
    <div
      class=${getDeferredContentClass(state.deferredContentClass)}
      nui-type=${state.nuiType || nothing}
      ?loaded=${state.loaded || nothing}
    >
      ${state.loaded ? html`<slot></slot>` : nothing}
    </div>
  `;
}
