import '../nui-icon/nui-icon.js';
import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiSelectButtonViewState, renderSelectButton } from './logic.js';
import { computeNextSelectButtonValue } from './select-button-value.js';
import type {
  SelectButtonOption,
  SelectButtonPrimitive,
  SelectButtonSize,
  SelectButtonValue,
} from './types.js';

const styles = createComponentStyles(
  'nui-select-button',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-select-button')
export class NuiSelectButton
  extends LitElement
  implements NuiSelectButtonViewState
{
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  options: SelectButtonOption[] = [];
  @property({ type: String, attribute: 'option-label' }) optionLabel = 'label';
  @property({ type: String, attribute: 'option-value' }) optionValue = 'value';
  @property({ type: String, attribute: 'option-disabled' })
  optionDisabled = 'disabled';
  @property({ type: String, attribute: 'option-icon' }) optionIcon = 'icon';
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  value: SelectButtonValue = null;
  @property({ type: Boolean, reflect: true }) multiple = false;
  @property({ type: Boolean, attribute: 'allow-empty' }) allowEmpty = true;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) fluid = false;
  @property({ type: String, reflect: true }) size: SelectButtonSize | '' = '';
  @property({ type: String, attribute: 'data-key' }) dataKey = '';
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledby = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'select-button-class' })
  selectButtonClass = '';

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

  private handleOptionClick = (
    event: Event,
    optionValue: SelectButtonPrimitive,
  ): void => {
    if (this.disabled) {
      return;
    }

    const result = computeNextSelectButtonValue(
      this.value,
      optionValue,
      this.multiple,
      this.allowEmpty,
    );

    if (!result.changed) {
      return;
    }

    this.value = result.value;

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value, originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    return renderSelectButton(this, this.handleOptionClick);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-select-button': NuiSelectButton;
  }
}
