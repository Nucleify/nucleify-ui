import { afterEach, describe, expect, it } from 'vitest';
import { nucleifyStyles } from '../src/config.js';
import { createComponentStyles } from '../src/utils/sync-stylesheet.js';
import { cleanup, render } from './helpers.js';

function sheetWith(text: string): CSSStyleSheet {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(text);
  return sheet;
}

describe('createComponentStyles', () => {
  afterEach(() => {
    cleanup();
    // Reset overrides between tests by registering a throwaway then clearing via map
    // nucleifyStyles only sets — re-register with a sentinel and rely on per-test tags.
  });

  it('adopts default stylesheet into shadow root', async () => {
    const defaultSheet = sheetWith('.host { color: red; }');
    const styles = createComponentStyles('nui-test-default', async () => ({
      default: defaultSheet,
    }));

    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);

    await styles.sync(root);
    expect(root.adoptedStyleSheets).toEqual([defaultSheet]);
  });

  it('clears sheets when unstyled', async () => {
    const defaultSheet = sheetWith('.host { color: red; }');
    const styles = createComponentStyles('nui-test-unstyled', async () => ({
      default: defaultSheet,
    }));

    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);

    await styles.sync(root);
    await styles.sync(root, { unstyled: true });
    expect(root.adoptedStyleSheets).toEqual([]);
  });

  it('reloads when nucleifyStyles override identity changes', async () => {
    const defaultSheet = sheetWith('.host { color: red; }');
    const styles = createComponentStyles('nui-test-override', async () => ({
      default: defaultSheet,
    }));

    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);

    await styles.sync(root);
    expect(root.adoptedStyleSheets[0]).toBe(defaultSheet);

    const first = sheetWith('.host { color: blue; }');
    nucleifyStyles({ 'nui-test-override': first });
    await styles.sync(root);
    expect(root.adoptedStyleSheets[0]).toBe(first);

    const second = sheetWith('.host { color: green; }');
    nucleifyStyles({ 'nui-test-override': second });
    await styles.sync(root);
    expect(root.adoptedStyleSheets[0]).toBe(second);
  });

  it('works for packaged-style sync on a real component', async () => {
    await import('../dist/components/nui-button/nui-button.js');

    const el = document.createElement('nui-button') as HTMLElement & {
      updateComplete: Promise<unknown>;
      unstyled: boolean;
    };
    await render(el);

    let sheets: CSSStyleSheet[] = [];
    for (let i = 0; i < 50; i++) {
      await new Promise((r) => setTimeout(r, 10));
      sheets = el.shadowRoot?.adoptedStyleSheets ?? [];
      if (sheets.length === 1) break;
    }

    expect(sheets.length).toBe(1);

    el.unstyled = true;
    await el.updateComplete;
    for (let i = 0; i < 50; i++) {
      await new Promise((r) => setTimeout(r, 10));
      sheets = el.shadowRoot?.adoptedStyleSheets ?? [];
      if (sheets.length === 0) break;
    }
    expect(sheets.length).toBe(0);
  });
});
