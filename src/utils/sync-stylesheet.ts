import type { PropertyValues } from 'lit';

export type StylesheetLoader = () => Promise<{ default: CSSStyleSheet }>;

export interface SyncStylesOptions {
  unstyled?: boolean;
}

export function createComponentStyles(load: StylesheetLoader) {
  let stylesheet: CSSStyleSheet | null = null;

  async function sync(
    renderRoot: Element | DocumentFragment,
    options: SyncStylesOptions = {},
  ): Promise<void> {
    if (!(renderRoot instanceof ShadowRoot)) {
      return;
    }

    if (options.unstyled) {
      renderRoot.adoptedStyleSheets = [];
      return;
    }

    if (!stylesheet) {
      const module = await load();
      stylesheet = module.default;
    }

    renderRoot.adoptedStyleSheets = [stylesheet];
  }

  return { sync };
}

export function syncStylesWhen(
  changed: PropertyValues,
  key: PropertyKey,
  sync: () => void | Promise<void>,
): void {
  if (changed.has(key)) {
    void sync();
  }
}
