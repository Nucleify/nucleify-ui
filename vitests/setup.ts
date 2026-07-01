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

// Chart.js needs a canvas context. Happy DOM doesn't implement it fully.
if (!HTMLCanvasElement.prototype.getContext) {
  // biome-ignore lint/suspicious/noExplicitAny: minimal stub for Chart.js
  HTMLCanvasElement.prototype.getContext = () => ({}) as any;
}

// Filter noisy logs that are expected in test DOM (keeps output clean in hooks/CI).
const originalWarn = console.warn.bind(console);
const originalError = console.error.bind(console);

function isNoise(message: unknown): boolean {
  const text = String(message ?? '');
  return (
    text.includes('Lit is in dev mode') ||
    text.includes('change-in-update') ||
    text.includes(`Failed to create chart: can't acquire context`)
  );
}

console.warn = (...args) => {
  if (args.some(isNoise)) return;
  originalWarn(...args);
};

console.error = (...args) => {
  if (args.some(isNoise)) return;
  originalError(...args);
};
