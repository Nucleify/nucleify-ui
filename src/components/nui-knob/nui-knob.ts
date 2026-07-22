import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { KnobController } from './knob-controller.js';
import { clampKnobValue } from './knob-math.js';
import { type NuiKnobViewState, renderKnob } from './logic.js';

const styles = createComponentStyles(
  'nui-knob',
  () => import('./styles.css', { with: { type: 'css' } }),
);

/** Lit treats any present boolean attribute as true; `show-value="false"` opts out. */
const showValueConverter = {
  fromAttribute(value: string | null): boolean {
    if (value === null || value === '') {
      return true;
    }

    if (value === 'false' || value === '0') {
      return false;
    }

    return true;
  },
  toAttribute(value: boolean): string | null {
    return value ? null : 'false';
  },
};

@customElement('nui-knob')
export class NuiKnob extends LitElement implements NuiKnobViewState {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: Number }) size = 100;
  @property({ type: Number, attribute: 'stroke-width' }) strokeWidth = 14;
  @property({
    type: Boolean,
    attribute: 'show-value',
    converter: showValueConverter,
  })
  showValue = true;
  @property({ type: String, attribute: 'value-template' })
  valueTemplate = '{value}';
  @property({ type: String, attribute: 'value-color' }) valueColor = '';
  @property({ type: String, attribute: 'range-color' }) rangeColor = '';
  @property({ type: String, attribute: 'text-color' }) textColor = '';
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Number }) tabindex = 0;
  @property({ type: String, attribute: 'aria-label' }) ariaLabel = '';
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledby = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'knob-class' }) knobClass = '';

  private controller: KnobController | null = null;

  protected createRenderRoot() {
    const root = super.createRenderRoot();
    void styles.sync(root, { unstyled: this.unstyled }).then(() => {
      this.requestUpdate();
    });
    return root;
  }

  protected firstUpdated() {
    this.normalizeValue();
    this.initController();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('value') || changed.has('min') || changed.has('max')) {
      this.normalizeValue();
    }

    if (
      changed.has('disabled') ||
      changed.has('readonly') ||
      changed.has('min') ||
      changed.has('max') ||
      changed.has('step')
    ) {
      this.initController();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.controller?.destroy();
    this.controller = null;
  }

  private normalizeValue(): void {
    const clamped = clampKnobValue(this.value, this.min, this.max);

    if (clamped !== this.value) {
      this.value = clamped;
    }
  }

  private initController(): void {
    const root = this.renderRoot.querySelector<SVGElement>('.nui-knob-svg');

    if (!root) {
      return;
    }

    this.controller?.destroy();
    this.controller = new KnobController({
      root,
      getMin: () => this.min,
      getMax: () => this.max,
      getStep: () => this.step,
      getDisabled: () => this.disabled,
      getReadonly: () => this.readonly,
      getValue: () => this.value,
      setValue: (value, emitChange) => this.updateValue(value, emitChange),
    });
  }

  private updateValue(nextValue: number, emitChange: boolean): void {
    const clamped = clampKnobValue(nextValue, this.min, this.max);

    if (this.value === clamped) {
      return;
    }

    this.value = clamped;

    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );

    if (emitChange) {
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  render() {
    return renderKnob(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-knob': NuiKnob;
  }
}
