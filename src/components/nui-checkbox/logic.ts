import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { CheckboxSize } from './types.js';

export interface NuiCheckboxViewState {
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
  invalid: boolean;
  size: CheckboxSize | '';
  name: string;
  value: string;
  readonly: boolean;
  required: boolean;
  inputId: string;
  ariaLabel: string;
  ariaLabelledby: string;
  nuiType: NuiType;
  checkboxClass: string;
}

export function getCheckboxClass(checkboxClass: string): string {
  return ['nui-checkbox', checkboxClass].filter(Boolean).join(' ');
}

export function renderCheckboxIcon(
  state: Pick<NuiCheckboxViewState, 'checked' | 'indeterminate'>,
): TemplateResult | typeof nothing {
  if (state.indeterminate) {
    return html`
      <nui-icon
        class="nui-checkbox-icon"
        icon="mdi:minus"
        width="0.875em"
        height="0.875em"
        aria-hidden="true"
      ></nui-icon>
    `;
  }

  if (state.checked) {
    return html`
      <nui-icon
        class="nui-checkbox-icon"
        icon="mdi:check"
        width="0.875em"
        height="0.875em"
        aria-hidden="true"
      ></nui-icon>
    `;
  }

  return nothing;
}

export function renderCheckbox(
  state: NuiCheckboxViewState,
  onChange: (event: Event) => void,
): TemplateResult {
  const isActive = state.checked || state.indeterminate;

  return html`
    <label
      class=${getCheckboxClass(state.checkboxClass)}
      size=${state.size || nothing}
      nui-type=${state.nuiType || nothing}
      ?disabled=${state.disabled || nothing}
    >
      <input
        class="nui-checkbox-input"
        type="checkbox"
        id=${state.inputId || nothing}
        name=${state.name || nothing}
        value=${state.value || nothing}
        .checked=${state.checked}
        ?disabled=${state.disabled || nothing}
        ?readonly=${state.readonly || nothing}
        ?required=${state.required || nothing}
        aria-label=${state.ariaLabel || nothing}
        aria-labelledby=${state.ariaLabelledby || nothing}
        aria-invalid=${state.invalid ? 'true' : nothing}
        aria-checked=${state.indeterminate ? 'mixed' : nothing}
        @change=${onChange}
      />
      <span
        class="nui-checkbox-box"
        ?checked=${isActive || nothing}
        ?indeterminate=${state.indeterminate || nothing}
        ?invalid=${state.invalid || nothing}
        ?disabled=${state.disabled || nothing}
      >
        ${renderCheckboxIcon(state)}
      </span>
    </label>
  `;
}
