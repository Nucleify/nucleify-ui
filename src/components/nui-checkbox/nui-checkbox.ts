import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiCheckboxViewState, renderCheckbox } from './logic.js';
import type { CheckboxSize } from './types.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-checkbox')
export class NuiCheckbox extends LitElement implements NuiCheckboxViewState {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) indeterminate = false;
  @property({ type: Boolean }) invalid = false;
  @property({ type: String }) size: CheckboxSize | '' = '';
  @property({ type: String }) name = '';
  @property({ type: String }) value = '';
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String, attribute: 'input-id' }) inputId = '';
  @property({ type: String, attribute: 'aria-label' }) ariaLabel = '';
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledby = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'checkbox-class' })
  checkboxClass = '';

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    this.syncInputIndeterminate();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('indeterminate') || changed.has('checked')) {
      this.syncInputIndeterminate();
    }
  }

  private syncInputIndeterminate(): void {
    const input = this.renderRoot.querySelector<HTMLInputElement>(
      '.nui-checkbox-input',
    );

    if (!input) {
      return;
    }

    input.indeterminate = this.indeterminate;
  }

  private handleChange = (event: Event): void => {
    const input = event.target as HTMLInputElement;

    if (this.indeterminate) {
      this.indeterminate = false;
    }

    this.checked = input.checked;

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    return renderCheckbox(this, this.handleChange);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-checkbox': NuiCheckbox;
  }
}
