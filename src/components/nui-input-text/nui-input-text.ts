import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiInputTextViewState, renderInputText } from './logic.js';
import type {
  InputTextSize,
  InputTextType,
  InputTextVariant,
} from './types.js';

const styles = createComponentStyles(
  'nui-input-text',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-input-text')
export class NuiInputText extends LitElement implements NuiInputTextViewState {
  @property({ type: String }) value = '';
  @property({ type: String }) type: InputTextType = 'text';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String }) name = '';
  @property({ type: String, attribute: 'input-id' }) inputId = '';
  @property({ type: String, attribute: 'aria-label' }) ariaLabel = '';
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledby = '';
  @property({ type: String }) autocomplete = '';
  @property({ type: Number }) maxlength = 0;
  @property({ type: Number }) minlength = 0;
  @property({ type: String, reflect: true }) size: InputTextSize | '' = '';
  @property({ type: String, reflect: true }) variant: InputTextVariant | '' =
    '';
  @property({ type: Boolean, reflect: true }) fluid = false;
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'input-class' }) inputClass = '';

  protected createRenderRoot() {
    const root = super.createRenderRoot();
    void styles.sync(root, { unstyled: this.unstyled });
    return root;
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  private handleInput = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    this.value = input.value;

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
    this.value = input.value;

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    return renderInputText(this, {
      onInput: this.handleInput,
      onChange: this.handleChange,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-input-text': NuiInputText;
  }
}
