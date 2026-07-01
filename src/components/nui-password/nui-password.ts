import { LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import { createComponentStyles } from '../../utils/sync-stylesheet.js';
import { type NuiPasswordViewState, renderPassword } from './logic.js';

const styles = createComponentStyles(
  'nui-password',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-password')
export class NuiPassword extends LitElement implements NuiPasswordViewState {
  @property({ type: String, attribute: 'model-value' }) modelValue = '';
  @property({ type: String }) id = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean, attribute: 'passwords-match' }) passwordsMatch =
    false;
  @property({ type: Boolean, attribute: 'empty-password' }) emptyPassword =
    false;
  @property({ type: Boolean, attribute: 'toggle-mask' }) toggleMask = false;
  @property({ type: Boolean }) feedback = true;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'password-class' }) passwordClass = '';

  @state() focused = false;
  @state() showPasswordText = false;

  protected firstUpdated() {
    void styles.sync(this.renderRoot);
  }

  private handleInput = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    this.modelValue = input.value;

    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: this.modelValue },
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent('update:modelValue', {
        detail: this.modelValue,
        bubbles: true,
        composed: true,
      }),
    );
  };

  private handleChange = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    this.modelValue = input.value;

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.modelValue },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private handleFocus = (): void => {
    this.focused = true;
  };

  private handleBlur = (): void => {
    this.focused = false;
  };

  private handleToggleMask = (): void => {
    this.showPasswordText = !this.showPasswordText;
  };

  render() {
    return renderPassword(this, {
      onInput: this.handleInput,
      onChange: this.handleChange,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      onToggleMask: this.handleToggleMask,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-password': NuiPassword;
  }
}
