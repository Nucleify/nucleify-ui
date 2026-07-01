import '../nui-icon/nui-icon.js';
import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import {
  isOptionDisabled,
  resolveOptionLabel,
  resolveOptionValue,
} from './auto-complete-options.js';
import type {
  AutoCompleteDropdownMode,
  AutoCompleteSize,
  AutoCompleteSuggestion,
  AutoCompleteVariant,
} from './types.js';

export interface NuiAutoCompleteViewState {
  suggestions: AutoCompleteSuggestion[];
  visibleSuggestions: AutoCompleteSuggestion[];
  query: string;
  optionLabel: string;
  optionValue: string;
  optionDisabled: string;
  placeholder: string;
  disabled: boolean;
  invalid: boolean;
  readonly: boolean;
  fluid: boolean;
  size: AutoCompleteSize | '';
  variant: AutoCompleteVariant | '';
  dropdown: boolean;
  dropdownMode: AutoCompleteDropdownMode;
  panelScrollHeight: string;
  emptyMessage: string;
  dropdownIcon: string;
  overlayVisible: boolean;
  focusedIndex: number;
  name: string;
  inputId: string;
  ariaLabel: string;
  ariaLabelledby: string;
  nuiType: NuiType;
  autoCompleteClass: string;
}

export interface AutoCompleteRenderHandlers {
  onInput: (event: Event) => void;
  onChange: (event: Event) => void;
  onFocus: (event: Event) => void;
  onBlur: (event: Event) => void;
  onKeydown: (event: KeyboardEvent) => void;
  onDropdownClick: (event: Event) => void;
  onOptionClick: (index: number) => void;
  onOptionMouseDown: (event: Event) => void;
}

export function getAutoCompleteClass(autoCompleteClass: string): string {
  return ['nui-auto-complete', autoCompleteClass].filter(Boolean).join(' ');
}

function getListboxId(inputId: string): string {
  return inputId ? `${inputId}-listbox` : 'nui-auto-complete-listbox';
}

export function renderAutoComplete(
  state: NuiAutoCompleteViewState,
  handlers: AutoCompleteRenderHandlers,
): TemplateResult {
  const listboxId = getListboxId(state.inputId);
  const activeDescendant =
    state.focusedIndex >= 0
      ? `${listboxId}-option-${state.focusedIndex}`
      : nothing;

  return html`
    <div
      class=${getAutoCompleteClass(state.autoCompleteClass)}
      nui-type=${state.nuiType || nothing}
      ?open=${state.overlayVisible || nothing}
    >
      <div class="nui-auto-complete-input-wrapper">
        <input
          class="nui-auto-complete-input"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded=${state.overlayVisible ? 'true' : 'false'}
          aria-controls=${state.overlayVisible ? listboxId : nothing}
          aria-activedescendant=${activeDescendant}
          id=${state.inputId || nothing}
          name=${state.name || nothing}
          placeholder=${state.placeholder || nothing}
          .value=${state.query}
          ?disabled=${state.disabled || nothing}
          ?readonly=${state.readonly || nothing}
          aria-label=${state.ariaLabel || nothing}
          aria-labelledby=${state.ariaLabelledby || nothing}
          aria-invalid=${state.invalid ? 'true' : nothing}
          autocomplete="off"
          @input=${handlers.onInput}
          @change=${handlers.onChange}
          @focus=${handlers.onFocus}
          @blur=${handlers.onBlur}
          @keydown=${handlers.onKeydown}
        />
        ${
          state.dropdown
            ? html`
                <button
                  type="button"
                  class="nui-auto-complete-dropdown"
                  ?disabled=${state.disabled || nothing}
                  aria-label="Show suggestions"
                  @click=${handlers.onDropdownClick}
                >
                  <nui-icon
                    icon=${state.dropdownIcon}
                    width="1em"
                    height="1em"
                    aria-hidden="true"
                  ></nui-icon>
                </button>
              `
            : nothing
        }
      </div>
      ${
        state.overlayVisible
          ? html`
              <div
                class="nui-auto-complete-panel"
                role="listbox"
                id=${listboxId}
                style=${`max-height:${state.panelScrollHeight}`}
              >
                ${
                  state.visibleSuggestions.length
                    ? state.visibleSuggestions.map((option, index) => {
                        const disabled = isOptionDisabled(
                          option,
                          state.optionDisabled,
                        );
                        const selected = state.focusedIndex === index;

                        return html`
                          <button
                            type="button"
                            class="nui-auto-complete-option"
                            role="option"
                            id=${`${listboxId}-option-${index}`}
                            aria-selected=${selected ? 'true' : 'false'}
                            ?disabled=${disabled || nothing}
                            ?focused=${selected || nothing}
                            @mousedown=${handlers.onOptionMouseDown}
                            @click=${() => handlers.onOptionClick(index)}
                          >
                            ${resolveOptionLabel(option, state.optionLabel)}
                          </button>
                        `;
                      })
                    : html`
                        <div class="nui-auto-complete-empty">
                          ${state.emptyMessage}
                        </div>
                      `
                }
              </div>
            `
          : nothing
      }
    </div>
  `;
}

export function getSelectedSuggestionValue(
  state: Pick<
    NuiAutoCompleteViewState,
    'visibleSuggestions' | 'optionLabel' | 'optionValue'
  >,
  index: number,
): string {
  const option = state.visibleSuggestions[index];

  if (!option) {
    return '';
  }

  return String(
    resolveOptionValue(option, state.optionValue, state.optionLabel),
  );
}
