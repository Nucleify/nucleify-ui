import '../nui-icon/nui-icon.js';
import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';

export interface NuiPasswordViewState {
  modelValue: string;
  id: string;
  disabled: boolean;
  placeholder: string;
  passwordsMatch: boolean;
  emptyPassword: boolean;
  toggleMask: boolean;
  feedback: boolean;
  nuiType: NuiType;
  passwordClass: string;
  focused: boolean;
  showPasswordText: boolean;
}

export interface PasswordRenderHandlers {
  onInput: (event: Event) => void;
  onChange: (event: Event) => void;
  onFocus: () => void;
  onBlur: () => void;
  onToggleMask: () => void;
}

// Validator helpers
export const hasLowercase = (val: string) => /[a-z]/.test(val);
export const hasUppercase = (val: string) => /[A-Z]/.test(val);
export const hasNumber = (val: string) => /[0-9]/.test(val);
export const hasMinLength = (val: string) => val.length >= 8;

export function renderPassword(
  state: NuiPasswordViewState,
  handlers: PasswordRenderHandlers,
): TemplateResult {
  const isOverlayVisible = state.feedback && state.focused;
  const inputType = state.showPasswordText ? 'text' : 'password';

  // Calculate criteria validity
  const val = state.modelValue || '';
  const criteria = [
    { label: 'At least one lowercase', isValid: hasLowercase(val) },
    { label: 'At least one uppercase', isValid: hasUppercase(val) },
    { label: 'At least one number', isValid: hasNumber(val) },
    { label: 'Minimum 8 characters', isValid: hasMinLength(val) },
  ];

  const validCount = criteria.filter((c) => c.isValid).length;
  let strengthPercent = 0;
  let strengthLabel = 'Weak';
  let strengthColor = '#ef4444'; // Red

  if (val.length > 0) {
    strengthPercent = (validCount / 4) * 100;
    if (validCount <= 1) {
      strengthLabel = 'Weak';
      strengthColor = '#ef4444';
    } else if (validCount <= 3) {
      strengthLabel = 'Medium';
      strengthColor = '#f59e0b'; // Orange
    } else {
      strengthLabel = 'Strong';
      strengthColor = '#10b981'; // Green
    }
  }

  const renderStrengthMeter = () => html`
    <div class="nui-password-meter">
      <div
        class="nui-password-meter-bar"
        style=${`width: ${strengthPercent}%; background-color: ${strengthColor};`}
      ></div>
    </div>
    <div class="nui-password-info">${strengthLabel} password</div>
    <div class="nui-password-divider"></div>
  `;

  const renderCriteriaList = () => html`
    <ul class="nui-password-criteria">
      ${criteria.map(
        (c) => html`
          <li class=${`nui-password-criterion ${c.isValid ? 'valid' : 'invalid'}`}>
            ${c.label}
          </li>
        `,
      )}
    </ul>
  `;

  const renderConfirmationList = () => {
    if (state.emptyPassword) {
      return nothing;
    }
    return html`
      <ul class="nui-password-criteria">
        <li class=${`nui-password-criterion ${state.passwordsMatch ? 'valid' : 'invalid'}`}>
          ${state.passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
        </li>
      </ul>
    `;
  };

  const getContainerClass = () => {
    return ['nui-password', state.passwordClass].filter(Boolean).join(' ');
  };

  return html`
    <div class=${getContainerClass()} nui-type=${state.nuiType || nothing}>
      <input
        class="nui-password-input"
        type=${inputType}
        .value=${state.modelValue}
        placeholder=${state.placeholder || nothing}
        ?disabled=${state.disabled}
        @input=${handlers.onInput}
        @change=${handlers.onChange}
        @focus=${handlers.onFocus}
        @blur=${handlers.onBlur}
        id=${state.id || nothing}
      />
      ${
        state.toggleMask
          ? html`
            <button
              class="nui-password-toggle"
              type="button"
              tabindex="-1"
              ?disabled=${state.disabled}
              @click=${handlers.onToggleMask}
              aria-label=${state.showPasswordText ? 'Hide password' : 'Show password'}
            >
              <nui-icon
                class="nui-password-toggle-icon"
                .icon=${state.showPasswordText ? 'mdi:eye-off' : 'mdi:eye'}
              ></nui-icon>
            </button>
          `
          : nothing
      }
      
      ${
        isOverlayVisible
          ? html`
            <div
              class="nui-password-overlay"
              id=${state.id ? `${state.id}_panel` : nothing}
            >
              ${
                state.id !== 'password_confirmation'
                  ? html`
                    ${renderStrengthMeter()}
                    ${renderCriteriaList()}
                  `
                  : renderConfirmationList()
              }
            </div>
          `
          : nothing
      }
    </div>
  `;
}
