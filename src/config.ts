import type { StylesheetLoader } from './utils/sync-stylesheet.js';

export type NuiComponentTag = `nui-${string}`;

export type NuiStyleOverride = CSSStyleSheet | StylesheetLoader;

export type NuiStylesMap = Partial<
  Record<NuiComponentTag, string | NuiStyleOverride>
>;

const styleOverrides = new Map<string, NuiStyleOverride>();

async function loadCssFile(
  path: string,
  base: string | URL,
): Promise<{ default: CSSStyleSheet }> {
  const url =
    path.startsWith('/') || /^[a-z]+:/i.test(path)
      ? path
      : new URL(path, base).href;

  try {
    const module = await import(/* @vite-ignore */ url);

    if (module.default instanceof CSSStyleSheet) {
      return module;
    }
  } catch {
    // Fall back to fetch for plain CSS files (e.g. in public/).
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `nucleifyStyles: could not load "${path}" (resolved to "${url}")`,
    );
  }

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(await response.text());
  return { default: sheet };
}

function toLoader(
  value: string | NuiStyleOverride,
  base: string | URL,
): NuiStyleOverride {
  if (typeof value !== 'string') {
    return value;
  }

  return () => loadCssFile(value, base);
}

/**
 * Register custom component styles from CSS file paths or loaders.
 *
 * Call before importing components. Paths are resolved against `base`
 * (defaults to `document.baseURI`). For files in `src/`, pass
 * `import.meta.url` from your app entry as the second argument.
 *
 * @example
 * nucleifyStyles({
 *   'nui-button': './styles/nui-button.css',
 * }, import.meta.url);
 *
 * @example
 * nucleifyStyles({
 *   'nui-button': '/styles/nui-button.css',
 * });
 */
export function nucleifyStyles(
  styles: NuiStylesMap,
  base: string | URL = typeof document !== 'undefined' ? document.baseURI : '/',
): void {
  for (const [tag, value] of Object.entries(styles)) {
    if (!value) {
      continue;
    }

    styleOverrides.set(tag, toLoader(value, base));
  }
}

/** Bind path resolution to a module URL (usually `import.meta.url` from your config file). */
export function createNucleifyStyles(base: string | URL) {
  return (styles: NuiStylesMap) => nucleifyStyles(styles, base);
}

export function getComponentStyleOverride(
  tag: string,
): NuiStyleOverride | undefined {
  return styleOverrides.get(tag);
}
