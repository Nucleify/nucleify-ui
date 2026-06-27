import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { isFloatLabelFilled } from './float-label-state.js';
import { type NuiFloatLabelViewState, renderFloatLabel } from './logic.js';
import type { FloatLabelVariant } from './types.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-float-label')
export class NuiFloatLabel
  extends LitElement
  implements NuiFloatLabelViewState
{
  @property({ type: String, reflect: true }) variant: FloatLabelVariant =
    'over';
  @property({ type: Boolean, reflect: true }) fluid = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'float-label-class' })
  floatLabelClass = '';

  @state() filled = false;
  @state() focused = false;

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    this.bindHostEvents();
    this.syncState();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindHostEvents();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (!changed.has('filled') && !changed.has('focused')) {
      this.syncState();
    }
  }

  private bindHostEvents(): void {
    this.addEventListener('focusin', this.handleFocusIn);
    this.addEventListener('focusout', this.handleFocusOut);
    this.addEventListener('input', this.handleValueChange);
    this.addEventListener('change', this.handleValueChange);
  }

  private unbindHostEvents(): void {
    this.removeEventListener('focusin', this.handleFocusIn);
    this.removeEventListener('focusout', this.handleFocusOut);
    this.removeEventListener('input', this.handleValueChange);
    this.removeEventListener('change', this.handleValueChange);
  }

  private handleFocusIn = (): void => {
    this.focused = true;
  };

  private handleFocusOut = (): void => {
    this.focused = false;
  };

  private handleValueChange = (): void => {
    this.syncFilled();
  };

  private handleSlotChange = (): void => {
    this.syncState();
  };

  private syncFilled(): void {
    const nextFilled = isFloatLabelFilled(this);

    if (this.filled !== nextFilled) {
      this.filled = nextFilled;
    }
  }

  private syncInvalidAndDisabled(): void {
    const control = this.querySelector(
      'nui-input-text, nui-textarea, nui-input-number, nui-input-mask',
    );

    if (!control) {
      return;
    }

    this.invalid = control.hasAttribute('invalid');
    this.disabled = control.hasAttribute('disabled');
  }

  private syncState(): void {
    this.syncFilled();
    this.syncInvalidAndDisabled();
  }

  render() {
    return renderFloatLabel(this, {
      onSlotChange: this.handleSlotChange,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-float-label': NuiFloatLabel;
  }
}
