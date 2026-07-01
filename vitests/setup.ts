/* Polyfills for Constructable Stylesheets in test DOM. */

declare global {
  // biome-ignore lint/suspicious/noExplicitAny: polyfill surface
  var CSSStyleSheet: any;
}

if (typeof globalThis.CSSStyleSheet === 'undefined') {
  globalThis.CSSStyleSheet = class CSSStyleSheet {
    cssText = '';
    replaceSync(text: string) {
      this.cssText = String(text);
    }
  };
}

// `adoptedStyleSheets` is used by components through `createComponentStyles`.
if (!('adoptedStyleSheets' in ShadowRoot.prototype)) {
  Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
    configurable: true,
    get() {
      // biome-ignore lint/suspicious/noExplicitAny: internal storage
      return (this as any).__adoptedStyleSheets ?? [];
    },
    set(value) {
      // biome-ignore lint/suspicious/noExplicitAny: internal storage
      (this as any).__adoptedStyleSheets = Array.isArray(value) ? value : [];
    },
  });
}

// Some DOM implementations spawn fetch tasks. Stub fetch to avoid noisy abort errors at teardown.
globalThis.fetch = async () =>
  new Response('', {
    status: 200,
    headers: { 'content-type': 'text/plain' },
  });
