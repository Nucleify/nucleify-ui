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

function expectedRootSelector(tag: string): string {
  switch (tag) {
    case 'nui-icon':
      return 'iconify-icon';
    case 'nui-image':
      return 'img';
    case 'nui-input-mask':
      return '.nui-input-mask-input';
    case 'nui-input-text':
      return '.nui-input-text-input';
    case 'nui-textarea':
      return '.nui-textarea-input';
    case 'nui-heading':
      return '.nui-heading';
    case 'nui-paragraph':
      return '.nui-paragraph';
    case 'nui-popover':
      return '.nui-popover-wrapper';
    case 'nui-swiper':
      return '.nui-swiper-container';
    case 'nui-toast':
      return '.nui-toast-container';
    default:
      return `.nui-${tag.slice(4)}`;
  }
}

describe('all components (behavior)', () => {
  afterEach(() => cleanup());

  it.each(tags)('%s renders expected root structure', async (tag) => {
    await import(`../dist/components/${tag}/${tag}.js`);

    const el = document.createElement(tag) as HTMLElement;

    // Provide minimal props to avoid empty renders in components that require them.
    if (tag === 'nui-icon') el.setAttribute('icon', 'mdi:check');
    if (tag === 'nui-heading') el.setAttribute('text', 'Heading');
    if (tag === 'nui-paragraph') el.setAttribute('text', 'Paragraph');
    if (tag === 'nui-image') el.setAttribute('src', 'about:blank');
    if (tag === 'nui-chart') {
      // biome-ignore lint/suspicious/noExplicitAny: loose runtime props for test
      (el as any).type = 'bar';
      // biome-ignore lint/suspicious/noExplicitAny: chart data shape
      (el as any).data = {
        labels: ['A'],
        datasets: [{ label: 'A', data: [1] }],
      };
    }

    // `nui-scroll-top` renders nothing until it becomes visible.
    if (tag === 'nui-scroll-top') {
      const wrapper = document.createElement('div');
      wrapper.style.height = '100px';
      wrapper.style.overflow = 'auto';
      const spacer = document.createElement('div');
      spacer.style.height = '1000px';
      wrapper.appendChild(spacer);
      wrapper.appendChild(el);
      document.body.appendChild(wrapper);

      el.setAttribute('target', 'parent');
      el.setAttribute('threshold', '0');

      // allow component to bind scroll listener (rAF)
      await new Promise((r) => setTimeout(r, 0));

      wrapper.scrollTop = 10;
      wrapper.dispatchEvent(new Event('scroll'));
      await new Promise((r) => setTimeout(r, 0));
    } else {
      await render(el);
    }

    const selector = expectedRootSelector(tag);
    const found = el.shadowRoot?.querySelector(selector);
    expect(found, `${tag} should contain ${selector}`).toBeTruthy();
  });
});
