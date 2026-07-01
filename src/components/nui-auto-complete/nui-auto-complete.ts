import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  filterSuggestions,
  findSuggestionByLabel,
  resolveDisplayText,
} from './auto-complete-options.js';
import {
  getSelectedSuggestionValue,
  type NuiAutoCompleteViewState,
  renderAutoComplete,
} from './logic.js';
import type {
  AutoCompleteDropdownMode,
  AutoCompleteSize,
  AutoCompleteSuggestion,
  AutoCompleteVariant,
} from './types.js';

const styles = createComponentStyles(
  'nui-auto-complete',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-auto-complete')
export class NuiAutoComplete
  extends LitElement
  implements NuiAutoCompleteViewState
{
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  suggestions: AutoCompleteSuggestion[] = [];
  @property({ type: String }) value = '';
  @property({ type: String, attribute: 'option-label' }) optionLabel = 'label';
  @property({ type: String, attribute: 'option-value' }) optionValue = 'value';
  @property({ type: String, attribute: 'option-disabled' })
  optionDisabled = 'disabled';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) fluid = false;
  @property({ type: Boolean, reflect: true }) dropdown = false;
  @property({ type: String, attribute: 'dropdown-mode' })
  dropdownMode: AutoCompleteDropdownMode = 'blank';
  @property({ type: String, reflect: true }) size: AutoCompleteSize | '' = '';
  @property({ type: String, reflect: true }) variant: AutoCompleteVariant | '' =
    '';
  @property({ type: String, attribute: 'scroll-height' }) scrollHeight =
    '14rem';
  @property({ type: Number, attribute: 'min-length' }) minLength = 1;
  @property({ type: Boolean, attribute: 'force-selection' })
  forceSelection = false;
  @property({ type: Boolean, attribute: 'complete-on-focus' })
  completeOnFocus = false;
  @property({ type: String, attribute: 'empty-message' }) emptyMessage =
    'No results found';
  @property({ type: String, attribute: 'dropdown-icon' })
  dropdownIcon = 'mdi:chevron-down';
  @property({ type: String }) name = '';
  @property({ type: String, attribute: 'input-id' }) inputId = '';
  @property({ type: String, attribute: 'aria-label' }) ariaLabel = '';
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledby = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'auto-complete-class' })
  autoCompleteClass = '';

  @state() query = '';
  @state() overlayVisible = false;
  @state() focusedIndex = -1;

  private blurTimer: ReturnType<typeof setTimeout> | null = null;
  private skipBlurClose = false;

  get visibleSuggestions(): AutoCompleteSuggestion[] {
    return filterSuggestions(this.suggestions, this.query, this.optionLabel);
  }

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    this.syncQueryFromValue();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.clearBlurTimer();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('value') && !changed.has('query')) {
      this.syncQueryFromValue();
    }

    if (changed.has('suggestions') && this.overlayVisible) {
      this.clampFocusedIndex();
    }
  }

  private syncQueryFromValue(): void {
    this.query = resolveDisplayText(
      this.value,
      this.suggestions,
      this.optionLabel,
      this.optionValue,
    );
  }

  private clearBlurTimer(): void {
    if (this.blurTimer) {
      clearTimeout(this.blurTimer);
      this.blurTimer = null;
    }
  }

  private openOverlay(): void {
    if (this.disabled || this.readonly) {
      return;
    }

    this.overlayVisible = true;
    this.clampFocusedIndex();
  }

  private closeOverlay(): void {
    this.overlayVisible = false;
    this.focusedIndex = -1;
  }

  private clampFocusedIndex(): void {
    const max = this.visibleSuggestions.length - 1;

    if (this.focusedIndex > max) {
      this.focusedIndex = max;
    }
  }

  private canShowSuggestions(query: string): boolean {
    return query.trim().length >= this.minLength || this.completeOnFocus;
  }

  private updateQuery(query: string, showOverlay = true): void {
    this.query = query;

    if (showOverlay && this.canShowSuggestions(query)) {
      this.openOverlay();
      return;
    }

    if (!this.canShowSuggestions(query)) {
      this.closeOverlay();
    }
  }

  private commitValue(nextValue: string, event?: Event): void {
    if (this.value === nextValue) {
      return;
    }

    this.value = nextValue;
    this.syncQueryFromValue();

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value, originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private selectSuggestion(index: number, event?: Event): void {
    const option = this.visibleSuggestions[index];

    if (!option) {
      return;
    }

    const nextValue = getSelectedSuggestionValue(this, index);
    this.commitValue(nextValue, event);
    this.closeOverlay();
  }

  private commitQueryAsValue(event?: Event): void {
    if (this.forceSelection) {
      const match = findSuggestionByLabel(
        this.suggestions,
        this.query,
        this.optionLabel,
      );

      if (match) {
        this.commitValue(
          String(
            getSelectedSuggestionValue(
              {
                visibleSuggestions: [match],
                optionLabel: this.optionLabel,
                optionValue: this.optionValue,
              },
              0,
            ),
          ),
          event,
        );
        return;
      }

      this.syncQueryFromValue();
      return;
    }

    this.commitValue(this.query, event);
  }

  private handleInput = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    this.updateQuery(input.value);
    this.focusedIndex = -1;
  };

  private handleChange = (event: Event): void => {
    this.commitQueryAsValue(event);
  };

  private handleFocus = (): void => {
    this.clearBlurTimer();

    if (this.completeOnFocus) {
      this.openOverlay();
    }
  };

  private handleBlur = (): void => {
    this.clearBlurTimer();
    this.blurTimer = setTimeout(() => {
      if (this.skipBlurClose) {
        this.skipBlurClose = false;
        return;
      }

      this.commitQueryAsValue();
      this.closeOverlay();
    }, 120);
  };

  private handleKeydown = (event: KeyboardEvent): void => {
    if (this.disabled || this.readonly) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (!this.overlayVisible) {
        this.openOverlay();
      }

      if (this.visibleSuggestions.length) {
        this.focusedIndex = Math.min(
          this.focusedIndex + 1,
          this.visibleSuggestions.length - 1,
        );
      }

      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (!this.overlayVisible) {
        this.openOverlay();
      }

      if (this.visibleSuggestions.length) {
        this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
      }

      return;
    }

    if (event.key === 'Enter' && this.overlayVisible) {
      event.preventDefault();

      if (this.focusedIndex >= 0) {
        this.selectSuggestion(this.focusedIndex, event);
        return;
      }

      this.commitQueryAsValue(event);
      this.closeOverlay();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.syncQueryFromValue();
      this.closeOverlay();
    }
  };

  private handleDropdownClick = (event: Event): void => {
    event.preventDefault();

    if (this.overlayVisible) {
      this.closeOverlay();
      return;
    }

    if (this.dropdownMode === 'blank') {
      this.query = '';
    }

    this.openOverlay();
  };

  private handleOptionMouseDown = (event: Event): void => {
    event.preventDefault();
    this.skipBlurClose = true;
  };

  private handleOptionClick = (index: number): void => {
    this.selectSuggestion(index);
    this.skipBlurClose = false;
  };

  render() {
    return renderAutoComplete(this, {
      onInput: this.handleInput,
      onChange: this.handleChange,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      onKeydown: this.handleKeydown,
      onDropdownClick: this.handleDropdownClick,
      onOptionClick: this.handleOptionClick,
      onOptionMouseDown: this.handleOptionMouseDown,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-auto-complete': NuiAutoComplete;
  }
}
