import { html, nothing, type TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { NuiType } from '../../types/nui-type.js';
import type { InputOtpSize, InputOtpVariant } from './types.js';

export interface NuiInputOtpViewState {
  tokens: string[];
  length: number;
  mask: boolean;
  integerOnly: boolean;
  disabled: boolean;
  readonly: boolean;
  invalid: boolean;
  tabindex: number;
  size: InputOtpSize | '';
  variant: InputOtpVariant | '';
  nuiType: NuiType;
  otpClass: string;
  inputClass: string;
  ariaLabel: string;
  ariaLabelledby: string;
}

export function valueToTokens(value: string, length: number): string[] {
  const tokens = value ? value.split('').slice(0, length) : [];

  while (tokens.length < length) {
    tokens.push('');
  }

  return tokens;
}

export function tokensToValue(tokens: string[]): string {
  return tokens.join('');
}

export function getOtpClass(otpClass: string): string {
  return ['nui-input-otp', otpClass].filter(Boolean).join(' ');
}

export function getInputClass(inputClass: string): string {
  return ['nui-input-otp-input', inputClass].filter(Boolean).join(' ');
}

export function renderInputOtp(state: NuiInputOtpViewState): TemplateResult {
  const tokens =
    state.tokens.length === state.length
      ? state.tokens
      : valueToTokens(tokensToValue(state.tokens), state.length);

  return html`
    <div
      class=${getOtpClass(state.otpClass)}
      nui-type=${state.nuiType || nothing}
      role="group"
      aria-label=${state.ariaLabel || nothing}
      aria-labelledby=${state.ariaLabelledby || nothing}
    >
      ${repeat(
        tokens,
        (_token, index) => index,
        (token, index) => html`
          <input
            class=${getInputClass(state.inputClass)}
            type=${state.mask ? 'password' : 'text'}
            inputmode=${state.integerOnly ? 'numeric' : 'text'}
            maxlength="1"
            .value=${token}
            data-index=${index}
            autocomplete="one-time-code"
            tabindex=${index === 0 ? (state.disabled ? -1 : state.tabindex) : -1}
            aria-label=${
              state.ariaLabel ? `${state.ariaLabel} ${index + 1}` : nothing
            }
            ?disabled=${state.disabled || nothing}
            ?readonly=${state.readonly || nothing}
            aria-invalid=${state.invalid ? 'true' : nothing}
          />
        `,
      )}
    </div>
  `;
}
