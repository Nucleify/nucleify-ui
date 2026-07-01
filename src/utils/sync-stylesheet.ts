import type { PropertyValues } from 'lit';
import { getComponentStyleOverride } from '../config.js';

export type StylesheetLoader = () => Promise<{ default: CSSStyleSheet }>;

export interface SyncStylesOptions {
  unstyled?: boolean;
}

async function resolveStylesheet(
  componentTag: string,
  defaultLoad: StylesheetLoader,
): Promise<CSSStyleSheet> {
  const override = getComponentStyleOverride(componentTag);

  if (override) {
    if (override instanceof CSSStyleSheet) {
      return override;
    }

    const module = await override();
    return module.default;
  }

  const module = await defaultLoad();
  return module.default;
}

export function createComponentStyles(
  componentTag: string,
  defaultLoad: StylesheetLoader,
) {
  let stylesheet: CSSStyleSheet | null = null;
  let activeSource: string | null = null;

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

    const sourceKey = getComponentStyleOverride(componentTag)
      ? 'override'
      : 'default';

    if (!stylesheet || activeSource !== sourceKey) {
      stylesheet = await resolveStylesheet(componentTag, defaultLoad);
      activeSource = sourceKey;
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
