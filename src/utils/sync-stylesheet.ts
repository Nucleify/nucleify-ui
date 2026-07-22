import type { PropertyValues } from 'lit';
import { getComponentStyleOverride } from '../config.js';

export type StylesheetLoader = () => Promise<{ default: CSSStyleSheet }>;

export interface SyncStylesOptions {
  unstyled?: boolean;
}

let pendingHostSheet: CSSStyleSheet | null = null;

function getPendingHostSheet(): CSSStyleSheet {
  if (!pendingHostSheet) {
    pendingHostSheet = new CSSStyleSheet();
    // Hide until real styles adopt — prevents FOUC of unstyled markup.
    pendingHostSheet.replaceSync(':host { visibility: hidden !important; }');
  }

  return pendingHostSheet;
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
  let activeOverride: ReturnType<typeof getComponentStyleOverride> | null =
    null;
  let usingDefault = false;
  let loadPromise: Promise<CSSStyleSheet> | null = null;
  let loadingOverride: ReturnType<typeof getComponentStyleOverride> | null =
    null;
  let loadingDefault = false;

  function needsReload(): boolean {
    const override = getComponentStyleOverride(componentTag);
    return override
      ? !stylesheet || activeOverride !== override
      : !stylesheet || !usingDefault;
  }

  function ensureLoaded(): Promise<CSSStyleSheet> {
    const override = getComponentStyleOverride(componentTag);

    if (!needsReload() && stylesheet) {
      return Promise.resolve(stylesheet);
    }

    const sameInflight = override
      ? loadPromise !== null && loadingOverride === override
      : loadPromise !== null && loadingDefault;

    if (sameInflight && loadPromise) {
      return loadPromise;
    }

    loadingOverride = override ?? null;
    loadingDefault = !override;
    loadPromise = resolveStylesheet(componentTag, defaultLoad).then((sheet) => {
      stylesheet = sheet;
      activeOverride = override ?? null;
      usingDefault = !override;
      loadPromise = null;
      return sheet;
    });

    return loadPromise;
  }

  // Start fetching as soon as the component module evaluates.
  void ensureLoaded().catch(() => {
    // Sync will retry; avoid unhandled rejection from eager preload.
  });

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

    if (!needsReload() && stylesheet) {
      renderRoot.adoptedStyleSheets = [stylesheet];
      return;
    }

    renderRoot.adoptedStyleSheets = [getPendingHostSheet()];
    const sheet = await ensureLoaded();
    renderRoot.adoptedStyleSheets = [sheet];
  }

  return { sync, preload: ensureLoaded };
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
