import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type {
  InputNumberButtonLayout,
  InputNumberMode,
  InputNumberSize,
  InputNumberVariant,
} from './types.js';

export interface NuiInputNumberViewState {
  inputValue: string;
  min: number | null;
  max: number | null;
  step: number;
  format: boolean;
  showButtons: boolean;
  buttonLayout: InputNumberButtonLayout;
  mode: InputNumberMode;
  locale: string;
  currency: string;
  useGrouping: boolean;
  minFractionDigits?: number;
  maxFractionDigits?: number;
  prefix: string;
  suffix: string;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  invalid: boolean;
  required: boolean;
  allowEmpty: boolean;
  size: InputNumberSize | '';
  variant: InputNumberVariant | '';
  fluid: boolean;
  nuiType: NuiType;
  inputClass: string;
  name: string;
  inputId: string;
  ariaLabel: string;
  ariaLabelledby: string;
  incrementIcon: string;
  decrementIcon: string;
  canIncrement: boolean;
  canDecrement: boolean;
}

export function getInputClass(inputClass: string): string {
  return ['nui-input-number-input', inputClass].filter(Boolean).join(' ');
}

export function getRootClass(state: NuiInputNumberViewState): string {
  return [
    'nui-input-number',
    state.showButtons ? `nui-input-number-${state.buttonLayout}` : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function getStepIcon(
  kind: 'increment' | 'decrement',
  state: NuiInputNumberViewState,
): string {
  const icon = kind === 'increment' ? state.incrementIcon : state.decrementIcon;

  if (state.buttonLayout === 'stacked') {
    return icon;
  }

  if (kind === 'increment' && icon === 'mdi:chevron-up') {
    return 'mdi:plus';
  }

  if (kind === 'decrement' && icon === 'mdi:chevron-down') {
    return 'mdi:minus';
  }

  return icon;
}

function renderStepButton(
  kind: 'increment' | 'decrement',
  state: NuiInputNumberViewState,
  handler: (event: Event) => void,
): TemplateResult {
  const icon = getStepIcon(kind, state);
  const disabled =
    state.disabled ||
    state.readonly ||
    (kind === 'increment' ? !state.canIncrement : !state.canDecrement);

  return html`
    <button
      type="button"
      class="nui-input-number-button nui-input-number-${kind}-button"
      tabindex="-1"
      ?disabled=${disabled || nothing}
      aria-hidden="true"
      @mousedown=${(event: Event) => event.preventDefault()}
      @click=${handler}
    >
      <nui-icon icon=${icon} aria-hidden="true"></nui-icon>
    </button>
  `;
}

export function renderInputNumber(
  state: NuiInputNumberViewState,
  handlers: {
    onInput: (event: Event) => void;
    onChange: (event: Event) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    onIncrement: (event: Event) => void;
    onDecrement: (event: Event) => void;
  },
): TemplateResult {
  const decrement = renderStepButton('decrement', state, handlers.onDecrement);
  const increment = renderStepButton('increment', state, handlers.onIncrement);

  const input = html`
    <input
      class=${getInputClass(state.inputClass)}
      type="text"
      inputmode="decimal"
      id=${state.inputId || nothing}
      name=${state.name || nothing}
      placeholder=${state.placeholder || nothing}
      .value=${state.inputValue}
      ?disabled=${state.disabled || nothing}
      ?readonly=${state.readonly || nothing}
      ?required=${state.required || nothing}
      aria-label=${state.ariaLabel || nothing}
      aria-labelledby=${state.ariaLabelledby || nothing}
      aria-invalid=${state.invalid ? 'true' : nothing}
      @input=${handlers.onInput}
      @change=${handlers.onChange}
      @keydown=${handlers.onKeyDown}
    />
  `;

  if (!state.showButtons) {
    return html`
      <div class=${getRootClass(state)} nui-type=${state.nuiType || nothing}>
        ${input}
      </div>
    `;
  }

  if (state.buttonLayout === 'horizontal') {
    return html`
      <div class=${getRootClass(state)} nui-type=${state.nuiType || nothing}>
        ${decrement}
        ${input}
        ${increment}
      </div>
    `;
  }

  if (state.buttonLayout === 'vertical') {
    return html`
      <div class=${getRootClass(state)} nui-type=${state.nuiType || nothing}>
        ${increment}
        ${input}
        ${decrement}
      </div>
    `;
  }

  return html`
    <div class=${getRootClass(state)} nui-type=${state.nuiType || nothing}>
      ${input}
      <div class="nui-input-number-button-group">
        ${increment}
        ${decrement}
      </div>
    </div>
  `;
}
