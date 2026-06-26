import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import {
  isOptionDisabled,
  isValueSelected,
  resolveOptionLabel,
  resolveOptionValue,
} from './listbox-options.js';
import type { ListboxOption, ListboxPrimitive, ListboxValue } from './types.js';

export interface NuiListboxViewState {
  options: ListboxOption[];
  visibleOptions: ListboxOption[];
  optionLabel: string;
  optionValue: string;
  optionDisabled: string;
  value: ListboxValue;
  multiple: boolean;
  disabled: boolean;
  invalid: boolean;
  readonly: boolean;
  filter: boolean;
  filterPlaceholder: string;
  filterValue: string;
  listScrollHeight: string;
  striped: boolean;
  checkmark: boolean;
  highlightOnSelect: boolean;
  emptyMessage: string;
  emptyFilterMessage: string;
  fluid: boolean;
  tabindex: number;
  ariaLabel: string;
  ariaLabelledby: string;
  focusedIndex: number;
  nuiType: NuiType;
  listboxClass: string;
}

export interface ListboxRenderHandlers {
  onFilterInput: (event: Event) => void;
  onOptionClick: (index: number) => void;
  onListFocus: () => void;
}

export function getListboxClass(listboxClass: string): string {
  return ['nui-listbox', listboxClass].filter(Boolean).join(' ');
}

function renderOption(
  state: NuiListboxViewState,
  option: ListboxOption,
  index: number,
  handlers: ListboxRenderHandlers,
): TemplateResult {
  const optionVal = resolveOptionValue(
    option,
    state.optionValue,
    state.optionLabel,
  );
  const selected = isValueSelected(state.value, optionVal, state.multiple);
  const disabled =
    state.disabled || isOptionDisabled(option, state.optionDisabled);
  const focused = state.focusedIndex === index;

  return html`
    <li
      class="nui-listbox-option"
      role="option"
      id=${`option-${index}`}
      aria-selected=${selected ? 'true' : 'false'}
      aria-disabled=${disabled ? 'true' : nothing}
      ?selected=${selected || nothing}
      ?focused=${focused || nothing}
      ?disabled=${disabled || nothing}
      @click=${() => handlers.onOptionClick(index)}
    >
      ${
        state.checkmark
          ? html`
              <span class="nui-listbox-check" aria-hidden="true">
                ${
                  selected
                    ? html`
                        <nui-icon
                          icon="mdi:check"
                          width="1em"
                          height="1em"
                          aria-hidden="true"
                        ></nui-icon>
                      `
                    : nothing
                }
              </span>
            `
          : nothing
      }
      <span class="nui-listbox-option-label">
        ${resolveOptionLabel(option, state.optionLabel)}
      </span>
    </li>
  `;
}

export function renderListbox(
  state: NuiListboxViewState,
  handlers: ListboxRenderHandlers,
): TemplateResult {
  const showEmptyFilter = state.filter && state.filterValue.trim().length > 0;
  const emptyText = showEmptyFilter
    ? state.emptyFilterMessage
    : state.emptyMessage;
  const listStyle = `max-height:${state.listScrollHeight}`;

  return html`
    <div
      class=${getListboxClass(state.listboxClass)}
      nui-type=${state.nuiType || nothing}
      ?striped=${state.striped || nothing}
      ?highlight=${state.highlightOnSelect || nothing}
    >
      ${
        state.filter
          ? html`
              <div class="nui-listbox-filter">
                <input
                  class="nui-listbox-filter-input"
                  type="search"
                  placeholder=${state.filterPlaceholder || nothing}
                  .value=${state.filterValue}
                  ?disabled=${state.disabled || nothing}
                  autocomplete="off"
                  @input=${handlers.onFilterInput}
                />
                <nui-icon
                  class="nui-listbox-filter-icon"
                  icon="mdi:magnify"
                  width="1em"
                  height="1em"
                  aria-hidden="true"
                ></nui-icon>
              </div>
            `
          : nothing
      }
      <ul
        class="nui-listbox-list"
        role="listbox"
        style=${listStyle}
        aria-multiselectable=${state.multiple ? 'true' : 'false'}
        aria-label=${state.ariaLabel || nothing}
        aria-labelledby=${state.ariaLabelledby || nothing}
        aria-activedescendant=${
          state.focusedIndex >= 0 ? `option-${state.focusedIndex}` : nothing
        }
        aria-disabled=${state.disabled ? 'true' : nothing}
        tabindex=${state.disabled ? -1 : state.tabindex}
        @focus=${handlers.onListFocus}
      >
        ${
          state.visibleOptions.length > 0
            ? state.visibleOptions.map((option, index) =>
                renderOption(state, option, index, handlers),
              )
            : html`<li class="nui-listbox-empty" role="presentation">${emptyText}</li>`
        }
      </ul>
    </div>
  `;
}

export function getOptionValueAt(
  options: ListboxOption[],
  index: number,
  optionValue: string,
  optionLabel: string,
): ListboxPrimitive | null {
  const option = options[index];

  if (!option) {
    return null;
  }

  return resolveOptionValue(option, optionValue, optionLabel);
}
