import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiRadioButtonViewState, renderRadioButton } from './logic.js';
import type { RadioButtonSize, RadioButtonVariant } from './types.js';

const styles = createComponentStyles(
  'nui-radio-button',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-radio-button')
export class NuiRadioButton
  extends LitElement
  implements NuiRadioButtonViewState
{
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: String }) value = '';
  @property({ type: String }) name = '';
  @property({ type: Boolean }) binary = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) invalid = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: String }) size: RadioButtonSize | '' = '';
  @property({ type: String, reflect: true }) variant: RadioButtonVariant | '' =
    '';
  @property({ type: Number }) tabindex?: number;
  @property({ type: String, attribute: 'input-id' }) inputId = '';
  @property({ type: String, attribute: 'aria-label' }) ariaLabel = '';
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledby = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'radio-button-class' })
  radioButtonClass = '';

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

  private handleClick = (event: Event): void => {
    if (this.disabled || this.readonly || !this.binary || !this.checked) {
      return;
    }

    event.preventDefault();

    this.checked = false;

    const input = this.renderRoot.querySelector(
      '.nui-radio-button-input',
    ) as HTMLInputElement | null;
    if (input) {
      input.checked = false;
    }

    this.dispatchChange();
  };

  private handleChange = (event: Event): void => {
    if (this.disabled || this.readonly) {
      return;
    }

    const input = event.target as HTMLInputElement;

    if (!this.binary && !input.checked) {
      return;
    }

    this.checked = input.checked;
    this.dispatchChange();
  };

  private dispatchChange(): void {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          checked: this.checked,
          value: this.binary ? this.checked : this.value,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return renderRadioButton(this, {
      onChange: this.handleChange,
      onClick: this.handleClick,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-radio-button': NuiRadioButton;
  }
}
