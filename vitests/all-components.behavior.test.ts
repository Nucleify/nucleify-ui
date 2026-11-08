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

  it.each([
    ['nui-textarea', '.nui-textarea-input', '[{"index":0}]'],
    ['nui-input-text', '.nui-input-text-input', 'hello'],
  ])('%s stops composed native input events from leaking past custom input event', async (tag, selector, sampleValue) => {
    await import(`../dist/components/${tag}/${tag}.js`);

    const el = document.createElement(tag) as HTMLElement;
    await render(el);

    const received: unknown[] = [];
    el.addEventListener('input', (event) => {
      received.push((event as CustomEvent).detail);
    });

    const inner = el.shadowRoot?.querySelector(selector) as
      | HTMLInputElement
      | HTMLTextAreaElement;
    inner.value = sampleValue;
    inner.dispatchEvent(
      new InputEvent('input', { bubbles: true, composed: true }),
    );

    expect(received).toEqual([{ value: sampleValue }]);
  });

  it('nui-date-picker switches between month and year views from header buttons', async () => {
    await import('../dist/components/nui-date-picker/nui-date-picker.js');

    const el = document.createElement('nui-date-picker') as HTMLElement & {
      value: string;
      updateComplete: Promise<boolean>;
    };
    el.value = '2026-11-06';
    await render(el);

    const trigger = el.shadowRoot?.querySelector(
      '.nui-date-picker-trigger',
    ) as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;

    const monthBtn = el.shadowRoot?.querySelector(
      'button[aria-label="Choose month"]',
    ) as HTMLButtonElement;
    expect(monthBtn).toBeTruthy();
    monthBtn.click();
    await el.updateComplete;

    const monthCells = el.shadowRoot?.querySelectorAll(
      '.nui-date-picker-months .nui-date-picker-cell',
    );
    expect(monthCells?.length).toBe(12);
    (monthCells?.[2] as HTMLButtonElement).click(); // March (index 2)
    await el.updateComplete;

    const yearBtn = el.shadowRoot?.querySelector(
      'button[aria-label="Choose year"]',
    ) as HTMLButtonElement;
    expect(yearBtn?.textContent?.trim()).toBe('2026');
    yearBtn.click();
    await el.updateComplete;

    const yearCells = [
      ...(el.shadowRoot?.querySelectorAll(
        '.nui-date-picker-years .nui-date-picker-cell',
      ) ?? []),
    ] as HTMLButtonElement[];
    expect(yearCells.length).toBe(10);
    const target2024 = yearCells.find(
      (btn) => btn.textContent?.trim() === '2024',
    );
    expect(target2024).toBeTruthy();
    target2024?.click();
    await el.updateComplete;

    const firstInMonthDay = el.shadowRoot?.querySelector(
      '.nui-date-picker-day:not([outside])',
    ) as HTMLButtonElement;
    firstInMonthDay.click();
    await el.updateComplete;

    expect(el.value).toBe('2024-03-01');
  });
});
