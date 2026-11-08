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

const isUnbundledDevServer =
  import.meta.url.startsWith('http') && /\.ts(\?|$)/.test(import.meta.url);

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

  if (isUnbundledDevServer) {
    try {
      const cssUrl = new URL(
        `../components/${componentTag}/styles.css`,
        import.meta.url,
      ).href;
      const response = await fetch(cssUrl, { cache: 'no-cache' });

      if (response.ok) {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(await response.text());
        return sheet;
      }
    } catch {
      // Fall back to constructable CSS module import below.
    }
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

    const pending = getPendingHostSheet();

    if (options.unstyled) {
      renderRoot.adoptedStyleSheets = renderRoot.adoptedStyleSheets.filter(
        (s) => s !== pending && s !== stylesheet,
      );
      return;
    }

    if (!needsReload() && stylesheet) {
      if (!renderRoot.adoptedStyleSheets.includes(stylesheet)) {
        const others = renderRoot.adoptedStyleSheets.filter(
          (s) => s !== pending && s !== stylesheet,
        );
        renderRoot.adoptedStyleSheets = [stylesheet, ...others];
      }
      return;
    }

    const currentSheet = stylesheet;
    const others = renderRoot.adoptedStyleSheets.filter(
      (s) => s !== currentSheet && s !== pending,
    );
    renderRoot.adoptedStyleSheets = [pending, ...others];

    const sheet = await ensureLoaded();
    const finalOthers = renderRoot.adoptedStyleSheets.filter(
      (s) => s !== pending && s !== currentSheet && s !== sheet,
    );
    renderRoot.adoptedStyleSheets = [sheet, ...finalOthers];
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
