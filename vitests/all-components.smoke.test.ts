import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from './helpers.js';

async function getAllComponentTags(): Promise<string[]> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');

  const root = path.resolve(process.cwd(), 'dist/components');
  const entries = await fs.readdir(root, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('nui-'))
    .map((entry) => entry.name)
    .sort();
}

const tags = await getAllComponentTags();

describe('all components', () => {
  afterEach(() => cleanup());

  it.each(tags)('%s imports + renders (smoke)', async (tag) => {
    // Side-effect import registers the custom element.
    await import(`../dist/components/${tag}/${tag}.js`);

    const ctor = customElements.get(tag);
    expect(ctor, `${tag} is not registered`).toBeTruthy();

    const el = document.createElement(tag) as HTMLElement;
    await render(el);

    expect(el.shadowRoot, `${tag} has no shadowRoot`).toBeTruthy();
    expect(
      (el.shadowRoot?.innerHTML ?? '').length,
      `${tag} rendered empty shadowRoot`,
    ).toBeGreaterThan(0);
  });
});
