import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiInputNumberViewState, renderInputNumber } from './logic.js';
import {
  clampNumber,
  formatNumber,
  type NumberFormatConfig,
  parseNumber,
  stepNumber,
} from './number-format.js';
import type {
  InputNumberButtonLayout,
  InputNumberMode,
  InputNumberSize,
  InputNumberVariant,
} from './types.js';

const styles = createComponentStyles(
  'nui-input-number',
  () => import('./styles.css', { with: { type: 'css' } }),
);

const nullableNumberConverter = {
  fromAttribute(value: string | null) {
    if (value === null || value === '') {
      return null;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
  },
  toAttribute(value: number | null) {
    if (value === null) {
      return null;
    }

    return String(value);
  },
};

@customElement('nui-input-number')
export class NuiInputNumber
  extends LitElement
  implements NuiInputNumberViewState
{
  @property({
    type: Number,
    converter: nullableNumberConverter,
  })
  value: number | null = null;
  @property({
    type: Number,
    converter: nullableNumberConverter,
  })
  min: number | null = null;
  @property({
    type: Number,
    converter: nullableNumberConverter,
  })
  max: number | null = null;
  @property({ type: Number }) step = 1;
  @property({ type: Boolean }) format = true;
  @property({ type: Boolean, attribute: 'show-buttons' }) showButtons = false;
  @property({ type: String, attribute: 'button-layout' })
  buttonLayout: InputNumberButtonLayout = 'stacked';
  @property({ type: String }) mode: InputNumberMode = 'decimal';
  @property({ type: String }) locale = '';
  @property({ type: String }) currency = 'USD';
  @property({ type: Boolean, attribute: 'use-grouping' }) useGrouping = true;
  @property({ type: Number, attribute: 'min-fraction-digits' })
  minFractionDigits: number | undefined;
  @property({ type: Number, attribute: 'max-fraction-digits' })
  maxFractionDigits: number | undefined;
  @property({ type: String }) prefix = '';
  @property({ type: String }) suffix = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, attribute: 'allow-empty' }) allowEmpty = true;
  @property({ type: String, reflect: true }) size: InputNumberSize | '' = '';
  @property({ type: String, reflect: true }) variant: InputNumberVariant | '' =
    '';
  @property({ type: Boolean, reflect: true }) fluid = false;
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'input-class' }) inputClass = '';
  @property({ type: String }) name = '';
  @property({ type: String, attribute: 'input-id' }) inputId = '';
  @property({ type: String, attribute: 'aria-label' }) ariaLabel = '';
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledby = '';
  @property({ type: String, attribute: 'increment-icon' })
  incrementIcon = 'mdi:chevron-up';
  @property({ type: String, attribute: 'decrement-icon' })
  decrementIcon = 'mdi:chevron-down';

  @state() inputValue = '';
  @state() canIncrement = true;
  @state() canDecrement = true;

  private syncingValue = false;

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    this.syncInputFromValue();
    this.updateStepState();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (
      changed.has('format') ||
      changed.has('mode') ||
      changed.has('locale') ||
      changed.has('currency') ||
      changed.has('useGrouping') ||
      changed.has('minFractionDigits') ||
      changed.has('maxFractionDigits') ||
      changed.has('prefix') ||
      changed.has('suffix')
    ) {
      this.syncDisplayFromValue();
    }

    if (
      changed.has('value') &&
      !this.syncingValue &&
      !changed.has('inputValue')
    ) {
      this.syncDisplayFromValue();
    }

    if (
      changed.has('value') ||
      changed.has('min') ||
      changed.has('max') ||
      changed.has('allowEmpty')
    ) {
      this.normalizeValue();
    }

    if (
      changed.has('value') ||
      changed.has('min') ||
      changed.has('max') ||
      changed.has('step') ||
      changed.has('format') ||
      changed.has('mode') ||
      changed.has('locale') ||
      changed.has('currency') ||
      changed.has('useGrouping') ||
      changed.has('minFractionDigits') ||
      changed.has('maxFractionDigits') ||
      changed.has('prefix') ||
      changed.has('suffix')
    ) {
      this.updateStepState();
    }
  }

  private normalizeValue(): void {
    if (this.value === null) {
      if (!this.allowEmpty) {
        const fallback = clampNumber(0, this.min, this.max);
        this.syncingValue = true;
        this.value = fallback;
        this.syncingValue = false;
        this.syncDisplayFromValue(true);
      }

      return;
    }

    const clamped = clampNumber(this.value, this.min, this.max);

    if (clamped === this.value) {
      return;
    }

    this.syncingValue = true;
    this.value = clamped;
    this.syncingValue = false;
    this.syncDisplayFromValue(true);
  }

  private isInputFocused(): boolean {
    const input = this.renderRoot.querySelector<HTMLInputElement>('input');

    return Boolean(input && this.shadowRoot?.activeElement === input);
  }

  private syncDisplayFromValue(force = false): void {
    if (!force && this.isInputFocused()) {
      return;
    }

    this.syncInputFromValue();
  }

  private refocusInput(): void {
    if (this.disabled || this.readonly) {
      return;
    }

    this.renderRoot.querySelector<HTMLInputElement>('input')?.focus();
  }

  private getFormatConfig(): NumberFormatConfig {
    return {
      format: this.format,
      mode: this.mode,
      locale: this.locale,
      currency: this.currency,
      useGrouping: this.useGrouping,
      minFractionDigits: this.minFractionDigits,
      maxFractionDigits: this.maxFractionDigits,
      prefix: this.prefix,
      suffix: this.suffix,
    };
  }

  private syncInputFromValue(): void {
    this.inputValue = formatNumber(this.value, this.getFormatConfig());
  }

  private updateStepState(): void {
    const step = this.step > 0 ? this.step : 1;
    const nextIncrement = stepNumber(this.value, step, 1, this.min, this.max);
    const nextDecrement = stepNumber(this.value, step, -1, this.min, this.max);

    this.canIncrement =
      nextIncrement !== null &&
      (this.value === null || nextIncrement !== this.value);
    this.canDecrement =
      nextDecrement !== null &&
      (this.value === null || nextDecrement !== this.value);
  }

  private commitValue(nextValue: number | null, emitChange: boolean): void {
    if (nextValue !== null) {
      nextValue = clampNumber(nextValue, this.min, this.max);
    } else if (!this.allowEmpty) {
      nextValue = clampNumber(0, this.min, this.max);
    }

    this.syncingValue = true;
    this.value = nextValue;
    this.inputValue = formatNumber(nextValue, this.getFormatConfig());
    this.syncingValue = false;
    this.updateStepState();

    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );

    if (emitChange) {
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private handleInput = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    this.inputValue = input.value;
    const parsed = parseNumber(this.inputValue, this.getFormatConfig());

    if (parsed === null && !this.allowEmpty) {
      return;
    }

    this.syncingValue = true;
    this.value = parsed;
    this.syncingValue = false;
    this.updateStepState();

    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private handleChange = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    const parsed = parseNumber(input.value, this.getFormatConfig());
    this.commitValue(parsed, true);
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled || this.readonly) {
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.applyStep(1, true);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.applyStep(-1, true);
    }
  };

  private handleIncrement = (event: Event): void => {
    event.preventDefault();
    this.applyStep(1, true);
    this.refocusInput();
  };

  private handleDecrement = (event: Event): void => {
    event.preventDefault();
    this.applyStep(-1, true);
    this.refocusInput();
  };

  private applyStep(direction: 1 | -1, emitChange: boolean): void {
    const step = this.step > 0 ? this.step : 1;
    const next = stepNumber(this.value, step, direction, this.min, this.max);

    if (next === null) {
      return;
    }

    this.commitValue(next, emitChange);
  }

  render() {
    return renderInputNumber(this, {
      onInput: this.handleInput,
      onChange: this.handleChange,
      onKeyDown: this.handleKeyDown,
      onIncrement: this.handleIncrement,
      onDecrement: this.handleDecrement,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-input-number': NuiInputNumber;
  }
}
