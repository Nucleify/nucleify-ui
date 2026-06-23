const MASK_DEFS: Record<string, string> = {
  '9': '[0-9]',
  a: '[A-Za-z]',
  '*': '[A-Za-z0-9]',
};

function isAndroidChrome(): boolean {
  const ua = navigator.userAgent;
  return /chrome/i.test(ua) && /android/i.test(ua);
}

export interface MaskControllerOptions {
  input: HTMLInputElement;
  mask: string;
  slotChar: string;
  autoClear: boolean;
  unmask: boolean;
  onValueChange: (value: string) => void;
  onComplete?: (event: Event) => void;
}

export class MaskController {
  private readonly input: HTMLInputElement;
  private mask: string;
  private slotChar: string;
  private autoClear: boolean;
  private unmask: boolean;
  private readonly onValueChange: (value: string) => void;
  private readonly onComplete?: (event: Event) => void;

  private tests: (RegExp | null)[] = [];
  private buffer: string[] = [];
  private len = 0;
  private partialPosition = 0;
  private firstNonMaskPos: number | null = null;
  private lastRequiredNonMaskPos = 0;
  private defaultBuffer = '';
  private focusText = '';
  private currentVal = '';
  private caretTimeoutId: ReturnType<typeof setTimeout> | undefined;
  private oldVal = '';
  private readonly androidChrome = isAndroidChrome();

  constructor(options: MaskControllerOptions) {
    this.input = options.input;
    this.mask = options.mask;
    this.slotChar = options.slotChar;
    this.autoClear = options.autoClear;
    this.unmask = options.unmask;
    this.onValueChange = options.onValueChange;
    this.onComplete = options.onComplete;

    this.bindEvents();
    this.initMask();
  }

  destroy(): void {
    if (this.caretTimeoutId) {
      clearTimeout(this.caretTimeoutId);
    }

    this.input.removeEventListener('input', this.handleInput);
    this.input.removeEventListener('focus', this.handleFocus);
    this.input.removeEventListener('blur', this.handleBlur);
    this.input.removeEventListener('keydown', this.handleKeyDown);
    this.input.removeEventListener('keypress', this.handleKeyPress);
    this.input.removeEventListener('paste', this.handlePaste);
  }

  updateOptions(options: Partial<MaskControllerOptions>): void {
    if (options.mask !== undefined && options.mask !== this.mask) {
      this.mask = options.mask;
      this.initMask();
      return;
    }

    if (options.slotChar !== undefined) {
      this.slotChar = options.slotChar;
      this.initMask();
      return;
    }

    if (options.autoClear !== undefined) {
      this.autoClear = options.autoClear;
    }

    if (options.unmask !== undefined) {
      this.unmask = options.unmask;
    }
  }

  setValue(value: string | null | undefined, emit = false): void {
    if (!this.mask) {
      this.input.value = value ?? '';
      this.currentVal = this.input.value;

      if (emit) {
        this.onValueChange(this.input.value);
      }

      return;
    }

    if (value == null || value === '') {
      this.input.value = '';
      this.currentVal = '';
      this.clearBuffer(0, this.len);

      if (emit) {
        this.onValueChange('');
      }

      return;
    }

    this.input.value = value;
    this.checkVal();
    this.writeBuffer();
    this.currentVal = this.input.value;
    this.focusText = this.input.value;

    if (emit) {
      this.updateModelValue(this.input.value);
    }
  }

  private bindEvents(): void {
    this.input.addEventListener('input', this.handleInput);
    this.input.addEventListener('focus', this.handleFocus);
    this.input.addEventListener('blur', this.handleBlur);
    this.input.addEventListener('keydown', this.handleKeyDown);
    this.input.addEventListener('keypress', this.handleKeyPress);
    this.input.addEventListener('paste', this.handlePaste);
  }

  private handleInput = (event: Event): void => {
    if (!this.mask) {
      this.updateModelValue(this.input.value);
      return;
    }

    const inputEvent = event as InputEvent;
    if (inputEvent.isComposing) {
      return;
    }

    if (this.androidChrome) {
      this.handleAndroidInput(event);
      return;
    }

    this.handleInputChange(event);
  };

  private handleFocus = (_event: Event): void => {
    if (!this.mask || this.input.readOnly) {
      return;
    }

    this.focusText = this.input.value;

    if (!this.input.value || this.input.value === this.defaultBuffer) {
      requestAnimationFrame(() => {
        if (this.input === document.activeElement) {
          this.caret(0, 0);
        }
      });
      return;
    }

    const pos = this.checkVal();
    this.caretTimeoutId = setTimeout(() => {
      if (this.input !== document.activeElement) {
        return;
      }

      this.writeBuffer();

      if (pos === this.mask.replace('?', '').length) {
        this.caret(0, pos);
      } else {
        this.caret(pos);
      }
    }, 10);
  };

  private handleBlur = (_event: Event): void => {
    if (!this.mask) {
      return;
    }

    this.checkVal();
    this.updateModelValue(this.input.value);

    if (this.input.value !== this.focusText) {
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.mask || this.input.readOnly) {
      return;
    }

    const code = event.code;
    let { begin, end } = this.caret();
    const iPhone = /iphone/i.test(navigator.userAgent);

    this.oldVal = this.input.value;

    if (
      code === 'Backspace' ||
      code === 'Delete' ||
      (iPhone && code === 'Escape')
    ) {
      if (end - begin === 0) {
        if (code !== 'Delete') {
          begin = this.seekPrev(begin);
        } else {
          end = this.seekNext(begin - 1);
        }

        end = code === 'Delete' ? this.seekNext(end) : end;
      }

      this.clearBuffer(begin, end);
      this.shiftL(begin, end - 1);
      this.updateModelValue(this.input.value);
      event.preventDefault();
    } else if (code === 'Enter') {
      this.input.blur();
      this.updateModelValue(this.input.value);
    } else if (code === 'Escape') {
      this.input.value = this.focusText;
      this.caret(0, this.checkVal());
      this.updateModelValue(this.input.value);
      event.preventDefault();
    }
  };

  private handleKeyPress = (event: KeyboardEvent): void => {
    if (!this.mask || this.input.readOnly) {
      return;
    }

    if (
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      event.shiftKey ||
      event.key === 'CapsLock' ||
      event.key === 'Escape' ||
      event.key === 'Tab'
    ) {
      return;
    }

    if (!event.key || event.key === 'Enter') {
      return;
    }

    const pos = this.caret();
    let completed = false;

    if (pos.end - pos.begin !== 0) {
      this.clearBuffer(pos.begin, pos.end);
      this.shiftL(pos.begin, pos.end - 1);
    }

    const p = this.seekNext(pos.begin - 1);

    if (p < this.len) {
      const c = event.key;

      if (this.tests[p]?.test(c)) {
        this.shiftR(p);
        this.buffer[p] = c;
        this.writeBuffer();
        const next = this.seekNext(p);

        if (this.androidChrome) {
          setTimeout(() => this.caret(next), 0);
        } else {
          this.caret(next);
        }

        if (pos.begin <= this.lastRequiredNonMaskPos) {
          completed = this.isCompleted();
        }
      }
    }

    this.updateModelValue(this.input.value);

    if (completed) {
      this.onComplete?.(event);
    }

    event.preventDefault();
  };

  private handlePaste = (event: Event): void => {
    if (!this.mask || this.input.readOnly) {
      return;
    }

    this.handleInputChange(event);
  };

  private handleInputChange(event: Event): void {
    const pos = this.checkVal(true);
    this.caret(pos);
    this.updateModelValue(this.input.value);

    if (this.isCompleted()) {
      this.onComplete?.(event);
    }
  }

  private handleAndroidInput(event: Event): void {
    const curVal = this.input.value;
    const pos = this.caret();

    if (this.oldVal && this.oldVal.length > curVal.length) {
      this.checkVal(true);
      while (pos.begin > 0 && !this.tests[pos.begin - 1]) {
        pos.begin--;
      }

      if (pos.begin === 0) {
        const firstPos = this.firstNonMaskPos ?? 0;
        while (pos.begin < firstPos && !this.tests[pos.begin]) {
          pos.begin++;
        }
      }

      this.caret(pos.begin, pos.begin);
    } else {
      this.checkVal(true);
      while (pos.begin < this.len && !this.tests[pos.begin]) {
        pos.begin++;
      }

      this.caret(pos.begin, pos.begin);
    }

    if (this.isCompleted()) {
      this.onComplete?.(event);
    }
  }

  private initMask(): void {
    if (!this.mask) {
      this.tests = [];
      this.buffer = [];
      this.len = 0;
      this.defaultBuffer = '';
      return;
    }

    this.tests = [];
    this.partialPosition = this.mask.length;
    this.len = this.mask.length;
    this.firstNonMaskPos = null;
    this.lastRequiredNonMaskPos = 0;

    const maskTokens = this.mask.split('');

    for (let i = 0; i < maskTokens.length; i++) {
      const c = maskTokens[i];

      if (c === '?') {
        this.len--;
        this.partialPosition = i;
      } else if (MASK_DEFS[c]) {
        this.tests.push(new RegExp(MASK_DEFS[c]));

        if (this.firstNonMaskPos === null) {
          this.firstNonMaskPos = this.tests.length - 1;
        }

        if (i < this.partialPosition) {
          this.lastRequiredNonMaskPos = this.tests.length - 1;
        }
      } else {
        this.tests.push(null);
      }
    }

    this.buffer = [];

    for (let i = 0; i < maskTokens.length; i++) {
      const c = maskTokens[i];

      if (c !== '?') {
        if (MASK_DEFS[c]) {
          this.buffer.push(this.getPlaceholder(i));
        } else {
          this.buffer.push(c);
        }
      }
    }

    this.defaultBuffer = this.buffer.join('');
  }

  private caret(first?: number, last?: number): { begin: number; end: number } {
    if (!this.input.offsetParent && this.input !== document.activeElement) {
      return { begin: 0, end: 0 };
    }

    if (typeof first === 'number') {
      const begin = first;
      const end = typeof last === 'number' ? last : begin;
      this.input.setSelectionRange(begin, end);
      return { begin, end };
    }

    return {
      begin: this.input.selectionStart ?? 0,
      end: this.input.selectionEnd ?? 0,
    };
  }

  private isCompleted(): boolean {
    for (
      let i = this.firstNonMaskPos ?? 0;
      i <= this.lastRequiredNonMaskPos;
      i++
    ) {
      if (this.tests[i] && this.buffer[i] === this.getPlaceholder(i)) {
        return false;
      }
    }

    return true;
  }

  private getPlaceholder(index: number): string {
    if (index < this.slotChar.length) {
      return this.slotChar.charAt(index);
    }

    return this.slotChar.charAt(0);
  }

  private seekNext(pos: number): number {
    while (++pos < this.len && !this.tests[pos]) {}

    return pos;
  }

  private seekPrev(pos: number): number {
    while (--pos >= 0 && !this.tests[pos]) {}

    return pos;
  }

  private shiftL(begin: number, end: number): void {
    if (begin < 0) {
      return;
    }

    let j = this.seekNext(end);

    for (let i = begin; i < this.len; i++) {
      if (this.tests[i]) {
        if (j < this.len && this.tests[j]?.test(this.buffer[j])) {
          this.buffer[i] = this.buffer[j];
          this.buffer[j] = this.getPlaceholder(j);
        } else {
          break;
        }

        j = this.seekNext(j);
      }
    }

    this.writeBuffer();
    this.caret(Math.max(this.firstNonMaskPos ?? 0, begin));
  }

  private shiftR(pos: number): void {
    let placeholder = this.getPlaceholder(pos);

    for (let i = pos; i < this.len; i++) {
      if (this.tests[i]) {
        const j = this.seekNext(i);
        const t = this.buffer[i];
        this.buffer[i] = placeholder;

        if (j < this.len && this.tests[j]?.test(t)) {
          placeholder = t;
        } else {
          break;
        }
      }
    }
  }

  private clearBuffer(start: number, end: number): void {
    for (let i = start; i < end && i < this.len; i++) {
      if (this.tests[i]) {
        this.buffer[i] = this.getPlaceholder(i);
      }
    }
  }

  private writeBuffer(): void {
    this.input.value = this.buffer.join('');
  }

  private checkVal(allow = false): number {
    const test = this.input.value;
    let lastMatch = -1;
    let i = 0;
    let pos = 0;

    for (i = 0; i < this.len; i++) {
      if (this.tests[i]) {
        this.buffer[i] = this.getPlaceholder(i);

        while (pos++ < test.length) {
          const c = test.charAt(pos - 1);

          if (this.tests[i]?.test(c)) {
            this.buffer[i] = c;
            lastMatch = i;
            break;
          }
        }

        if (pos > test.length) {
          this.clearBuffer(i + 1, this.len);
          break;
        }
      } else if (this.buffer[i] === test.charAt(pos)) {
        pos++;
        if (i < this.partialPosition) {
          lastMatch = i;
        }
      }
    }

    if (allow) {
      this.writeBuffer();
    } else if (lastMatch + 1 < this.partialPosition) {
      if (this.autoClear || this.buffer.join('') === this.defaultBuffer) {
        if (this.input.value) {
          this.input.value = '';
        }

        this.clearBuffer(0, this.len);
      } else {
        this.writeBuffer();
      }
    } else {
      this.writeBuffer();
      this.input.value = this.input.value.substring(0, lastMatch + 1);
    }

    return this.partialPosition ? i : (this.firstNonMaskPos ?? 0);
  }

  private getUnmaskedValue(): string {
    const unmaskedBuffer: string[] = [];

    for (let i = 0; i < this.buffer.length; i++) {
      const c = this.buffer[i];

      if (this.tests[i] && c !== this.getPlaceholder(i)) {
        unmaskedBuffer.push(c);
      }
    }

    return unmaskedBuffer.join('');
  }

  private updateModelValue(displayValue: string): void {
    if (this.currentVal === displayValue) {
      return;
    }

    const value = this.unmask ? this.getUnmaskedValue() : displayValue;
    this.currentVal = displayValue;
    this.onValueChange(this.defaultBuffer !== value ? value : '');
  }
}
