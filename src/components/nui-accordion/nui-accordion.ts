import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { isPanelOpen, toggleAccordionValue } from './accordion-value.js';
import { type NuiAccordionViewState, renderAccordion } from './logic.js';
import type { AccordionPanel, AccordionValue } from './types.js';

const styles = createComponentStyles(
  'nui-accordion',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-accordion')
export class NuiAccordion extends LitElement implements NuiAccordionViewState {
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  panels: AccordionPanel[] = [];
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  value: AccordionValue = null;
  @property({ type: Boolean, reflect: true }) multiple = false;
  @property({ type: Boolean, reflect: true }) lazy = false;
  @property({ type: String, attribute: 'expand-icon' }) expandIcon =
    'mdi:chevron-right';
  @property({ type: String, attribute: 'collapse-icon' }) collapseIcon =
    'mdi:chevron-right';
  @property({ type: Number }) tabindex = 0;
  @property({ type: Boolean, attribute: 'select-on-focus' })
  selectOnFocus = false;
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'accordion-class' })
  accordionClass = '';

  @state() lazyOpened = new Set<string>();

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('value') && this.lazy) {
      this.trackLazyOpenedFromValue();
    }
  }

  private trackLazyOpenedFromValue(): void {
    const next = new Set(this.lazyOpened);

    if (this.multiple && Array.isArray(this.value)) {
      for (const entry of this.value) {
        next.add(String(entry));
      }
    } else if (this.value !== null && !Array.isArray(this.value)) {
      next.add(String(this.value));
    }

    this.lazyOpened = next;
  }

  private handleHeaderClick = (
    panelValue: AccordionPanel['index'],
    event: Event,
  ): void => {
    const nextValue = toggleAccordionValue(
      this.value,
      panelValue,
      this.multiple,
    );

    if (this.lazy) {
      const nextOpened = new Set(this.lazyOpened);
      nextOpened.add(String(panelValue));
      this.lazyOpened = nextOpened;
    }

    this.value = nextValue;

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value, originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private handleHeaderFocus = (
    panelValue: AccordionPanel['index'],
    event: Event,
  ): void => {
    if (!this.selectOnFocus) {
      return;
    }

    if (isPanelOpen(this.value, panelValue, this.multiple)) {
      return;
    }

    this.handleHeaderClick(panelValue, event);
  };

  render() {
    return renderAccordion(this, {
      onHeaderClick: this.handleHeaderClick,
      onHeaderFocus: this.handleHeaderFocus,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-accordion': NuiAccordion;
  }
}
