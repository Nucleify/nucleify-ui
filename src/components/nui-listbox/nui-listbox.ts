import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { ListboxController } from './listbox-controller.js';
import {
  filterOptions,
  normalizeListboxValue,
  toggleMultipleValue,
} from './listbox-options.js';
import {
  getOptionValueAt,
  type NuiListboxViewState,
  renderListbox,
} from './logic.js';
import type { ListboxOption, ListboxPrimitive, ListboxValue } from './types.js';

const styles = createComponentStyles(
  'nui-listbox',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-listbox')
export class NuiListbox extends LitElement implements NuiListboxViewState {
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  options: ListboxOption[] = [];
  @property({ type: String, attribute: 'option-label' }) optionLabel = 'label';
  @property({ type: String, attribute: 'option-value' }) optionValue = 'value';
  @property({ type: String, attribute: 'option-disabled' })
  optionDisabled = 'disabled';
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  value: ListboxValue = null;
  @property({ type: Boolean, reflect: true }) multiple = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) filter = false;
  @property({ type: String, attribute: 'filter-placeholder' })
  filterPlaceholder = '';
  @property({ type: String, attribute: 'scroll-height' }) listScrollHeight =
    '14rem';
  @property({ type: Boolean, reflect: true }) striped = false;
  @property({ type: Boolean, reflect: true }) checkmark = false;
  @property({ type: Boolean, attribute: 'highlight-on-select' })
  highlightOnSelect = true;
  @property({ type: String, attribute: 'empty-message' }) emptyMessage =
    'No results found';
  @property({ type: String, attribute: 'empty-filter-message' })
  emptyFilterMessage = 'No results found';
  @property({ type: Boolean, reflect: true }) fluid = false;
  @property({ type: Number }) tabindex = 0;
  @property({ type: String, attribute: 'aria-label' }) ariaLabel = '';
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledby = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'listbox-class' }) listboxClass = '';

  @state() filterValue = '';
  @state() focusedIndex = -1;

  private controller: ListboxController | null = null;

  get visibleOptions(): ListboxOption[] {
    return filterOptions(this.options, this.filterValue, this.optionLabel);
  }

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    this.initController();
    this.syncFocusedIndex();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (
      changed.has('options') ||
      changed.has('filterValue') ||
      changed.has('value')
    ) {
      this.syncFocusedIndex();
    }

    if (
      changed.has('disabled') ||
      changed.has('readonly') ||
      changed.has('filter')
    ) {
      this.initController();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.controller?.destroy();
    this.controller = null;
  }

  private initController(): void {
    const root =
      this.renderRoot.querySelector<HTMLElement>('.nui-listbox-list');

    if (!root) {
      return;
    }

    this.controller?.destroy();
    this.controller = new ListboxController({
      root,
      getDisabled: () => this.disabled,
      getReadonly: () => this.readonly,
      getOptionCount: () => this.visibleOptions.length,
      getFocusedIndex: () => this.focusedIndex,
      setFocusedIndex: (index) => {
        this.focusedIndex = index;
      },
      selectFocused: () => this.selectOption(this.focusedIndex),
      isFilterTarget: (target) =>
        target instanceof HTMLElement &&
        target.classList.contains('nui-listbox-filter-input'),
    });
  }

  private syncFocusedIndex(): void {
    const count = this.visibleOptions.length;

    if (count === 0) {
      this.focusedIndex = -1;
      return;
    }

    if (this.focusedIndex >= count) {
      this.focusedIndex = count - 1;
    }
  }

  private handleFilterInput = (event: Event): void => {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.focusedIndex = this.visibleOptions.length > 0 ? 0 : -1;
  };

  private handleListFocus = (): void => {
    if (this.focusedIndex < 0 && this.visibleOptions.length > 0) {
      this.focusedIndex = 0;
    }
  };

  private handleOptionClick = (index: number): void => {
    this.focusedIndex = index;
    this.selectOption(index);
  };

  private selectOption(index: number): void {
    if (this.disabled || this.readonly) {
      return;
    }

    const optionVal = getOptionValueAt(
      this.visibleOptions,
      index,
      this.optionValue,
      this.optionLabel,
    );

    if (optionVal === null) {
      return;
    }

    if (this.multiple) {
      const current = normalizeListboxValue(
        this.value,
        true,
      ) as ListboxPrimitive[];
      this.updateValue(toggleMultipleValue(current, optionVal), true);
      return;
    }

    this.updateValue(optionVal, true);
  }

  private updateValue(nextValue: ListboxValue, emitChange: boolean): void {
    const normalized = normalizeListboxValue(nextValue, this.multiple);

    if (this.valuesMatch(this.value, normalized)) {
      return;
    }

    this.value = normalized;

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

  private valuesMatch(a: ListboxValue, b: ListboxValue): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
      return (
        a.length === b.length &&
        a.every((entry, index) => String(entry) === String(b[index]))
      );
    }

    if (!Array.isArray(a) && !Array.isArray(b)) {
      return String(a ?? '') === String(b ?? '');
    }

    return false;
  }

  render() {
    return renderListbox(this, {
      onFilterInput: this.handleFilterInput,
      onOptionClick: this.handleOptionClick,
      onListFocus: this.handleListFocus,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-listbox': NuiListbox;
  }
}
