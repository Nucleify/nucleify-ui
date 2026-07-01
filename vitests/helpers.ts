export async function render<T extends HTMLElement>(el: T): Promise<T> {
  document.body.appendChild(el);

  // Lit `updateComplete` for many components
  // biome-ignore lint/suspicious/noExplicitAny: lit updateComplete
  if (typeof (el as any).updateComplete?.then === 'function') {
    // biome-ignore lint/suspicious/noExplicitAny: lit updateComplete
    await (el as any).updateComplete;
  } else {
    await Promise.resolve();
  }

  return el;
}

export function cleanup() {
  document.body.innerHTML = '';
}

export function normalizeLitHtml(html: string): string {
  return (
    html
      // Lit internal marker ids are non-deterministic between runs.
      .replaceAll(/lit\$\d+\$/g, 'lit$ID$')
  );
}
