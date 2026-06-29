import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  type NuiSelectHandlers,
  type NuiSelectViewState,
  renderSelect,
} from './logic.js';
import type { SelectOption } from './types.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-select')
export class NuiSelect extends LitElement implements NuiSelectViewState {
  @property({ type: String }) value = '';
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  options: SelectOption[] = [];
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) fluid = false;
  @property({ type: String, reflect: true }) size: 'small' | '' | 'large' = '';
  @property({ type: String, reflect: true }) variant: '' | 'filled' = '';
  @property({ type: String, attribute: 'select-class' }) selectClass = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';

  @state() open = false;

  private _boundClickOutside: (e: MouseEvent) => void;

  constructor() {
    super();
    this._boundClickOutside = (e: MouseEvent) => {
      if (!e.composedPath().includes(this)) {
        this.open = false;
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._boundClickOutside);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._boundClickOutside);
  }

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  private get _handlers(): NuiSelectHandlers {
    return {
      onToggle: () => {
        if (!this.disabled) {
          this.open = !this.open;
        }
      },
      onSelect: (value: string) => {
        this.value = value;
        this.open = false;
        this.dispatchEvent(
          new CustomEvent('nui-change', {
            detail: { value },
            bubbles: true,
            composed: true,
          }),
        );
      },
      onKeydown: (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          this.open = false;
        }
        if (e.key === 'Enter' || e.key === ' ') {
          if (!this.open) {
            this.open = true;
            e.preventDefault();
          }
        }
      },
    };
  }

  render() {
    return renderSelect(this, this._handlers);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-select': NuiSelect;
  }
}
