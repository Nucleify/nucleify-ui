import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  clampSliderValue,
  type NuiSliderViewState,
  renderSlider,
} from './logic.js';
import { SliderController } from './slider-controller.js';
import type { SliderOrientation, SliderValue } from './types.js';

const styles = createComponentStyles(
  'nui-slider',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-slider')
export class NuiSlider extends LitElement implements NuiSliderViewState {
  @property({ type: Number }) value = 0;
  @property({ type: Number, attribute: 'value-high' }) valueHigh = 100;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 0;
  @property({ type: Boolean }) range = false;
  @property({ type: String, reflect: true }) orientation: SliderOrientation =
    'horizontal';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Number }) tabindex = 0;
  @property({ type: String, attribute: 'aria-label' }) ariaLabel = '';
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledby = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'slider-class' }) sliderClass = '';

  private controller: SliderController | null = null;

  protected createRenderRoot() {
    const root = super.createRenderRoot();
    void styles.sync(root, { unstyled: this.unstyled });
    return root;
  }

  protected firstUpdated() {
    this.initController();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (
      changed.has('range') ||
      changed.has('orientation') ||
      changed.has('disabled')
    ) {
      this.initController();
    }

    if (
      changed.has('value') ||
      changed.has('valueHigh') ||
      changed.has('min') ||
      changed.has('max') ||
      changed.has('range')
    ) {
      this.normalizeValues();
    }
  }

  private normalizeValues(): void {
    const low = clampSliderValue(this.value, this.min, this.max);
    const high = clampSliderValue(this.valueHigh, this.min, this.max);

    if (this.range) {
      if (this.value !== low) {
        this.value = low;
      }

      if (this.valueHigh !== Math.max(high, low)) {
        this.valueHigh = Math.max(high, low);
      }

      return;
    }

    if (this.value !== low) {
      this.value = low;
    }

    if (this.valueHigh !== low) {
      this.valueHigh = low;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.controller?.destroy();
    this.controller = null;
  }

  private initController(): void {
    const root = this.renderRoot.querySelector<HTMLElement>('.nui-slider');

    if (!root) {
      return;
    }

    this.controller?.destroy();
    this.controller = new SliderController({
      root,
      getMin: () => this.min,
      getMax: () => this.max,
      getStep: () => this.step,
      getRange: () => this.range,
      getOrientation: () => this.orientation,
      getDisabled: () => this.disabled,
      getValues: () => [this.value, this.valueHigh],
      setValues: (low, high, emitChange) => {
        this.updateValues(low, high, emitChange);
      },
      onSlideEnd: (event) => {
        this.dispatchEvent(
          new CustomEvent('slideend', {
            detail: { value: this.getModelValue(), originalEvent: event },
            bubbles: true,
            composed: true,
          }),
        );
      },
    });
  }

  private getModelValue(): SliderValue {
    return this.range ? [this.value, this.valueHigh] : this.value;
  }

  private updateValues(low: number, high: number, emitChange: boolean): void {
    const nextLow = low;
    const nextHigh = this.range ? high : low;

    if (this.value === nextLow && this.valueHigh === nextHigh) {
      return;
    }

    this.value = nextLow;
    this.valueHigh = nextHigh;

    if (emitChange) {
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { value: this.getModelValue() },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  render() {
    return renderSlider(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-slider': NuiSlider;
  }
}
