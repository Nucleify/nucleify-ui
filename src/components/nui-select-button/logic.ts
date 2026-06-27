import '../nui-icon/nui-icon.js';
import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import {
  isOptionDisabled,
  isValueSelected,
  resolveOptionIcon,
  resolveOptionLabel,
  resolveOptionValue,
} from './select-button-options.js';
import type {
  SelectButtonOption,
  SelectButtonPrimitive,
  SelectButtonValue,
} from './types.js';

export interface NuiSelectButtonViewState {
  options: SelectButtonOption[];
  optionLabel: string;
  optionValue: string;
  optionDisabled: string;
  optionIcon: string;
  value: SelectButtonValue;
  multiple: boolean;
  disabled: boolean;
  invalid: boolean;
  fluid: boolean;
  size: string;
  dataKey: string;
  ariaLabelledby: string;
  nuiType: NuiType;
  selectButtonClass: string;
}

export function getSelectButtonClass(selectButtonClass: string): string {
  return ['nui-select-button', selectButtonClass].filter(Boolean).join(' ');
}

function getOptionKey(
  option: SelectButtonOption,
  optionValue: SelectButtonPrimitive,
  optionLabel: string,
  dataKey: string,
  index: number,
): string {
  if (dataKey && typeof option === 'object') {
    const key = option[dataKey];

    if (key !== undefined && key !== null) {
      return String(key);
    }
  }

  const label = resolveOptionLabel(option, optionLabel);

  return `${String(optionValue)}-${label}-${index}`;
}

export function renderSelectButton(
  state: NuiSelectButtonViewState,
  onOptionClick: (event: Event, optionValue: SelectButtonPrimitive) => void,
): TemplateResult {
  return html`
    <div
      class=${getSelectButtonClass(state.selectButtonClass)}
      role="group"
      aria-labelledby=${state.ariaLabelledby || nothing}
      nui-type=${state.nuiType || nothing}
    >
      ${state.options.map((option, index) => {
        const optionVal = resolveOptionValue(
          option,
          state.optionValue,
          state.optionLabel,
        );
        const label = resolveOptionLabel(option, state.optionLabel);
        const icon = resolveOptionIcon(option, state.optionIcon);
        const disabled =
          state.disabled || isOptionDisabled(option, state.optionDisabled);
        const selected = isValueSelected(
          state.value,
          optionVal,
          state.multiple,
        );

        return html`
          <button
            type="button"
            class="nui-select-button-option"
            data-key=${getOptionKey(
              option,
              optionVal,
              state.optionLabel,
              state.dataKey,
              index,
            )}
            aria-pressed=${selected ? 'true' : 'false'}
            ?disabled=${disabled || nothing}
            ?selected=${selected || nothing}
            @click=${(event: Event) => onOptionClick(event, optionVal)}
          >
            ${
              icon
                ? html`
                    <nui-icon
                      class="nui-select-button-icon"
                      icon=${icon}
                      aria-hidden="true"
                    ></nui-icon>
                  `
                : nothing
            }
            ${
              label
                ? html`<span class="nui-select-button-label">${label}</span>`
                : nothing
            }
          </button>
        `;
      })}
    </div>
  `;
}
