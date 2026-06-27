const INPUT_SELECTORS = [
  'nui-input-text',
  'nui-textarea',
  'nui-input-number',
  'nui-input-mask',
  'input',
  'textarea',
].join(', ');

function readControlValue(control: Element): string {
  if (
    control instanceof HTMLInputElement ||
    control instanceof HTMLTextAreaElement
  ) {
    return control.value;
  }

  if ('value' in control) {
    const value = (control as { value?: unknown }).value;

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number') {
      return String(value);
    }
  }

  const inner = control.shadowRoot?.querySelector('input, textarea');

  if (
    inner instanceof HTMLInputElement ||
    inner instanceof HTMLTextAreaElement
  ) {
    return inner.value;
  }

  return '';
}

export function findFloatLabelControl(root: HTMLElement): Element | null {
  return root.querySelector(INPUT_SELECTORS);
}

export function isFloatLabelFilled(root: HTMLElement): boolean {
  const control = findFloatLabelControl(root);

  if (!control) {
    return false;
  }

  return readControlValue(control).trim().length > 0;
}
