import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  type NuiInputOtpViewState,
  renderInputOtp,
  tokensToValue,
  valueToTokens,
} from './logic.js';
import { OtpController } from './otp-controller.js';
import type { InputOtpSize, InputOtpVariant } from './types.js';

const styles = createComponentStyles(
  'nui-input-otp',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-input-otp')
export class NuiInputOtp extends LitElement implements NuiInputOtpViewState {
  @property({ type: String }) value = '';
  @property({ type: Number }) length = 4;
  @property({ type: Boolean }) mask = false;
  @property({ type: Boolean, attribute: 'integer-only' }) integerOnly = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Number }) tabindex = 0;
  @property({ type: String, reflect: true }) size: InputOtpSize | '' = '';
  @property({ type: String, reflect: true }) variant: InputOtpVariant | '' = '';
  @property({ type: Boolean, reflect: true }) fluid = false;
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'otp-class' }) otpClass = '';
  @property({ type: String, attribute: 'input-class' }) inputClass = '';
  @property({ type: String, attribute: 'aria-label' }) ariaLabel = '';
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledby = '';

  @state() tokens: string[] = valueToTokens('', 4);

  private controller: OtpController | null = null;
  private syncingValue = false;

  protected createRenderRoot() {
    const root = super.createRenderRoot();
    void styles.sync(root, { unstyled: this.unstyled });
    return root;
  }

  protected firstUpdated() {
    this.syncTokensFromValue();
    this.initController();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('length')) {
      const nextValue = this.integerOnly
        ? this.value.replace(/\D/g, '')
        : this.value;

      if (nextValue !== this.value) {
        this.syncingValue = true;
        this.value = nextValue;
        this.syncingValue = false;
      }

      if (this.value.length > this.length) {
        this.syncingValue = true;
        this.value = this.value.slice(0, this.length);
        this.syncingValue = false;
      }

      this.syncTokensFromValue();
      this.initController();
    }

    if (changed.has('value') && !this.syncingValue) {
      this.syncTokensFromValue();
    }

    if (
      changed.has('integerOnly') ||
      changed.has('readonly') ||
      changed.has('disabled')
    ) {
      this.initController();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.controller?.destroy();
    this.controller = null;
  }

  private isAnyInputFocused(): boolean {
    const active = this.shadowRoot?.activeElement;

    return Boolean(
      active instanceof HTMLInputElement &&
        active.classList.contains('nui-input-otp-input'),
    );
  }

  private syncTokensFromValue(): void {
    if (this.isAnyInputFocused()) {
      return;
    }

    let nextValue = this.value;

    if (this.integerOnly) {
      nextValue = nextValue.replace(/\D/g, '');
    }

    if (nextValue.length > this.length) {
      nextValue = nextValue.slice(0, this.length);
    }

    if (nextValue !== this.value) {
      this.syncingValue = true;
      this.value = nextValue;
      this.syncingValue = false;
    }

    this.tokens = valueToTokens(this.value, this.length);
  }

  private initController(): void {
    const root = this.renderRoot.querySelector<HTMLElement>('.nui-input-otp');

    if (!root) {
      return;
    }

    this.controller?.destroy();
    this.controller = new OtpController({
      root,
      getLength: () => this.length,
      getIntegerOnly: () => this.integerOnly,
      getReadonly: () => this.readonly,
      getDisabled: () => this.disabled,
      getTokens: () => this.tokens,
      setTokens: (tokens, event) => this.updateTokens(tokens, event),
      onFocus: (event) => {
        this.dispatchEvent(
          new CustomEvent('focus', {
            detail: { originalEvent: event },
            bubbles: true,
            composed: true,
          }),
        );
      },
      onBlur: (event) => {
        this.dispatchEvent(
          new CustomEvent('blur', {
            detail: { originalEvent: event },
            bubbles: true,
            composed: true,
          }),
        );
      },
    });
  }

  private updateTokens(tokens: string[], event: Event): void {
    const nextValue = tokensToValue(tokens);

    this.tokens = tokens;

    if (this.value !== nextValue) {
      this.syncingValue = true;
      this.value = nextValue;
      this.syncingValue = false;
    }

    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: this.value, originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value, originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return renderInputOtp(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-input-otp': NuiInputOtp;
  }
}
