export interface OtpControllerOptions {
  root: HTMLElement;
  getLength: () => number;
  getIntegerOnly: () => boolean;
  getReadonly: () => boolean;
  getDisabled: () => boolean;
  getTokens: () => string[];
  setTokens: (tokens: string[], event: Event) => void;
  onFocus: (event: FocusEvent) => void;
  onBlur: (event: FocusEvent) => void;
}

export class OtpController {
  private readonly root: HTMLElement;
  private readonly options: OtpControllerOptions;

  constructor(options: OtpControllerOptions) {
    this.root = options.root;
    this.options = options;
    this.bindEvents();
  }

  destroy(): void {
    this.root.removeEventListener('input', this.handleInput);
    this.root.removeEventListener('keydown', this.handleKeyDown);
    this.root.removeEventListener('focus', this.handleFocus, true);
    this.root.removeEventListener('blur', this.handleBlur, true);
    this.root.removeEventListener('click', this.handleClick, true);
    this.root.removeEventListener('paste', this.handlePaste);
  }

  private bindEvents(): void {
    this.root.addEventListener('input', this.handleInput);
    this.root.addEventListener('keydown', this.handleKeyDown);
    this.root.addEventListener('focus', this.handleFocus, true);
    this.root.addEventListener('blur', this.handleBlur, true);
    this.root.addEventListener('click', this.handleClick, true);
    this.root.addEventListener('paste', this.handlePaste);
  }

  private getInput(target: EventTarget | null): HTMLInputElement | null {
    const element = target as HTMLElement | null;

    if (!element?.classList.contains('nui-input-otp-input')) {
      return null;
    }

    return element as HTMLInputElement;
  }

  private handleInput = (event: Event): void => {
    const input = this.getInput(event.target);

    if (!input || this.options.getReadonly() || this.options.getDisabled()) {
      return;
    }

    const index = Number(input.dataset.index ?? '0');
    const tokens = [...this.options.getTokens()];
    const inputEvent = event as InputEvent;

    tokens[index] = input.value.slice(-1);
    const inputType = inputEvent.inputType;
    this.options.setTokens(tokens, event);

    queueMicrotask(() => {
      const inputs = this.getInputs();

      if (inputType === 'deleteContentBackward') {
        inputs[index - 1]?.focus();
        inputs[index - 1]?.select();
        return;
      }

      if (inputType === 'insertText' || inputType === 'deleteContentForward') {
        inputs[index + 1]?.focus();
        inputs[index + 1]?.select();
      }
    });
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    const input = this.getInput(event.target);

    if (!input || this.options.getReadonly() || this.options.getDisabled()) {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        this.moveToPrev(input);
        event.preventDefault();
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        break;
      case 'Backspace':
        if (input.value.length === 0) {
          this.moveToPrev(input);
          event.preventDefault();
        }
        break;
      case 'ArrowRight':
        this.moveToNext(input);
        event.preventDefault();
        break;
      case 'Enter':
      case 'Tab':
        break;
      default: {
        const hasSelection = input.selectionStart !== input.selectionEnd;
        const isAtMaxLength =
          this.options.getTokens().join('').length >= this.options.getLength();
        const isValidKey = this.options.getIntegerOnly()
          ? /^[0-9]$/.test(event.key)
          : event.key.length === 1;

        if (
          !isValidKey ||
          (isAtMaxLength && event.key !== 'Delete' && !hasSelection)
        ) {
          event.preventDefault();
        }
      }
    }
  };

  private handleFocus = (event: FocusEvent): void => {
    const input = this.getInput(event.target);

    if (!input) {
      return;
    }

    input.select();
    this.options.onFocus(event);
  };

  private handleBlur = (event: FocusEvent): void => {
    const input = this.getInput(event.target);

    if (!input) {
      return;
    }

    this.options.onBlur(event);
  };

  private handleClick = (event: Event): void => {
    const input = this.getInput(event.target);

    if (!input) {
      return;
    }

    window.setTimeout(() => input.select(), 1);
  };

  private handlePaste = (event: ClipboardEvent): void => {
    const input = this.getInput(event.target);

    if (
      !input ||
      this.options.getReadonly() ||
      this.options.getDisabled() ||
      !event.clipboardData
    ) {
      return;
    }

    const paste = event.clipboardData.getData('text');
    const length = this.options.getLength();

    if (!paste.length) {
      return;
    }

    const pastedCode = paste.slice(0, length);
    const integerOnly = this.options.getIntegerOnly();

    if (integerOnly && !/^\d+$/.test(pastedCode)) {
      event.preventDefault();
      return;
    }

    const tokens = pastedCode.split('').slice(0, length);

    while (tokens.length < length) {
      tokens.push('');
    }

    this.options.setTokens(tokens, event);
    event.preventDefault();

    const nextIndex = Math.min(pastedCode.length, length - 1);
    const inputs = this.getInputs();
    inputs[nextIndex]?.focus();
    inputs[nextIndex]?.select();
  };

  private getInputs(): HTMLInputElement[] {
    return [
      ...this.root.querySelectorAll<HTMLInputElement>('.nui-input-otp-input'),
    ];
  }

  private moveToPrev(element: HTMLInputElement): void {
    const prev = this.findSiblingInput(element, 'previous');

    if (!prev) {
      return;
    }

    prev.focus();
    prev.select();
  }

  private moveToNext(element: HTMLInputElement): void {
    const next = this.findSiblingInput(element, 'next');

    if (!next) {
      return;
    }

    next.focus();
    next.select();
  }

  private findSiblingInput(
    element: HTMLInputElement,
    direction: 'next' | 'previous',
  ): HTMLInputElement | null {
    let sibling =
      direction === 'next'
        ? element.nextElementSibling
        : element.previousElementSibling;

    while (sibling) {
      if (sibling instanceof HTMLInputElement) {
        return sibling;
      }

      sibling =
        direction === 'next'
          ? sibling.nextElementSibling
          : sibling.previousElementSibling;
    }

    return null;
  }
}
