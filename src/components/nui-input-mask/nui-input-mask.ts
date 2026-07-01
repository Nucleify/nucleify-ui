import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiInputMaskViewState, renderInputMask } from './logic.js';
import { MaskController } from './mask-controller.js';
import type { InputMaskSize, InputMaskVariant } from './types.js';

const styles = createComponentStyles(
  'nui-input-mask',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-input-mask')
export class NuiInputMask extends LitElement implements NuiInputMaskViewState {
  @property({ type: String }) value = '';
  @property({ type: String }) mask = '';
  @property({ type: String, attribute: 'slot-char' }) slotChar = '_';
  @property({ type: Boolean, attribute: 'auto-clear' }) autoClear = true;
  @property({ type: Boolean }) unmask = false;
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: String }) name = '';
  @property({ type: String, attribute: 'input-id' }) inputId = '';
  @property({ type: String, attribute: 'aria-label' }) ariaLabel = '';
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledby = '';
  @property({ type: String, reflect: true }) size: InputMaskSize | '' = '';
  @property({ type: String, reflect: true }) variant: InputMaskVariant | '' =
    '';
  @property({ type: Boolean, reflect: true }) fluid = false;
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'input-class' }) inputClass = '';

  private controller: MaskController | null = null;
  private syncingValue = false;

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    this.initController();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (
      changed.has('mask') ||
      changed.has('slotChar') ||
      changed.has('autoClear') ||
      changed.has('unmask')
    ) {
      this.controller?.updateOptions({
        mask: this.mask,
        slotChar: this.slotChar,
        autoClear: this.autoClear,
        unmask: this.unmask,
      });

      if (changed.has('mask') || changed.has('slotChar')) {
        this.controller?.setValue(this.value);
      }
    }

    if (changed.has('value')) {
      if (!this.syncingValue) {
        this.controller?.setValue(this.value);
      }

      this.syncingValue = false;
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.controller?.destroy();
    this.controller = null;
  }

  private getInput(): HTMLInputElement | null {
    return this.renderRoot.querySelector('.nui-input-mask-input');
  }

  private initController(): void {
    const input = this.getInput();

    if (!input) {
      return;
    }

    this.controller?.destroy();
    this.controller = new MaskController({
      input,
      mask: this.mask,
      slotChar: this.slotChar,
      autoClear: this.autoClear,
      unmask: this.unmask,
      onValueChange: this.handleValueChange,
      onComplete: this.handleComplete,
    });

    if (this.value) {
      this.controller.setValue(this.value);
    }
  }

  private handleValueChange = (nextValue: string): void => {
    if (this.value === nextValue) {
      return;
    }

    this.syncingValue = true;
    this.value = nextValue;

    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: nextValue },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private handleComplete = (event: Event): void => {
    this.dispatchEvent(
      new CustomEvent('complete', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    return renderInputMask(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-input-mask': NuiInputMask;
  }
}
