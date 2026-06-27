import '../nui-icon/nui-icon.js';
import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import {
  buildCalendarDays,
  formatDisplayDate,
  getMonthLabel,
  getWeekdayLabels,
  parseIsoDate,
  toIsoDate,
} from './date-utils.js';
import type { DatePickerSize, DatePickerVariant } from './types.js';

export interface NuiDatePickerViewState {
  value: string;
  displayValue: string;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  invalid: boolean;
  required: boolean;
  fluid: boolean;
  size: DatePickerSize | '';
  variant: DatePickerVariant | '';
  showIcon: boolean;
  icon: string;
  manualInput: boolean;
  name: string;
  inputId: string;
  ariaLabel: string;
  ariaLabelledby: string;
  overlayVisible: boolean;
  visibleMonth: Date;
  selectedDate: Date | null;
  today: Date;
  nuiType: NuiType;
  datePickerClass: string;
}

export interface DatePickerRenderHandlers {
  onInput: (event: Event) => void;
  onChange: (event: Event) => void;
  onFocus: (event: Event) => void;
  onBlur: (event: Event) => void;
  onIconClick: (event: Event) => void;
  onIconMouseDown: (event: Event) => void;
  onPrevMonth: (event: Event) => void;
  onNextMonth: (event: Event) => void;
  onDayClick: (iso: string, event: Event) => void;
  onPanelMouseDown: (event: Event) => void;
}

export function getDatePickerClass(datePickerClass: string): string {
  return ['nui-date-picker', datePickerClass].filter(Boolean).join(' ');
}

function renderCalendar(
  state: NuiDatePickerViewState,
  handlers: DatePickerRenderHandlers,
): TemplateResult {
  const days = buildCalendarDays(state.visibleMonth);
  const weekdays = getWeekdayLabels();

  return html`
    <div
      class="nui-date-picker-panel"
      role="dialog"
      aria-label="Choose date"
      @mousedown=${handlers.onPanelMouseDown}
    >
      <div class="nui-date-picker-header">
        <button
          type="button"
          class="nui-date-picker-nav"
          aria-label="Previous month"
          @click=${handlers.onPrevMonth}
        >
          ‹
        </button>
        <div class="nui-date-picker-title">${getMonthLabel(state.visibleMonth)}</div>
        <button
          type="button"
          class="nui-date-picker-nav"
          aria-label="Next month"
          @click=${handlers.onNextMonth}
        >
          ›
        </button>
      </div>
      <div class="nui-date-picker-weekdays">
        ${weekdays.map(
          (label) =>
            html`<span class="nui-date-picker-weekday">${label}</span>`,
        )}
      </div>
      <div class="nui-date-picker-days">
        ${days.map((day) => {
          const selected =
            state.selectedDate !== null &&
            day.date.getTime() === state.selectedDate.getTime();
          const today = day.date.getTime() === state.today.getTime();

          return html`
            <button
              type="button"
              class="nui-date-picker-day"
              ?selected=${selected || nothing}
              ?today=${today || nothing}
              ?outside=${!day.inMonth || nothing}
              @click=${(event: Event) => handlers.onDayClick(day.iso, event)}
            >
              ${day.date.getDate()}
            </button>
          `;
        })}
      </div>
    </div>
  `;
}

export function renderDatePicker(
  state: NuiDatePickerViewState,
  handlers: DatePickerRenderHandlers,
): TemplateResult {
  return html`
    <div
      class=${getDatePickerClass(state.datePickerClass)}
      nui-type=${state.nuiType || nothing}
      ?open=${state.overlayVisible || nothing}
    >
      <div class="nui-date-picker-input-wrapper">
        <input
          class="nui-date-picker-input"
          type="text"
          id=${state.inputId || nothing}
          name=${state.name || nothing}
          placeholder=${state.placeholder || nothing}
          .value=${state.displayValue}
          ?disabled=${state.disabled || nothing}
          ?readonly=${state.readonly || !state.manualInput || nothing}
          ?required=${state.required || nothing}
          aria-label=${state.ariaLabel || nothing}
          aria-labelledby=${state.ariaLabelledby || nothing}
          aria-invalid=${state.invalid ? 'true' : nothing}
          aria-expanded=${state.overlayVisible ? 'true' : 'false'}
          autocomplete="off"
          @input=${handlers.onInput}
          @change=${handlers.onChange}
          @focus=${handlers.onFocus}
          @blur=${handlers.onBlur}
        />
        ${
          state.showIcon
            ? html`
                <button
                  type="button"
                  class="nui-date-picker-trigger"
                  ?disabled=${state.disabled || nothing}
                  aria-label="Open calendar"
                  @mousedown=${handlers.onIconMouseDown}
                  @click=${handlers.onIconClick}
                >
                  <nui-icon
                    icon=${state.icon}
                    width="1em"
                    height="1em"
                    aria-hidden="true"
                  ></nui-icon>
                </button>
              `
            : nothing
        }
      </div>
      ${state.overlayVisible ? renderCalendar(state, handlers) : nothing}
    </div>
  `;
}

export function getVisibleMonth(value: string, fallback = new Date()): Date {
  return parseIsoDate(value) ?? fallback;
}

export function getSelectedDate(value: string): Date | null {
  return parseIsoDate(value);
}

export function getDisplayValue(value: string, dateFormat: string): string {
  if (!value) {
    return '';
  }

  return formatDisplayDate(value, dateFormat);
}

export function commitIsoValue(iso: string): string {
  if (!iso) {
    return '';
  }

  return parseIsoDate(iso) ? iso : '';
}

export function shiftVisibleMonth(current: Date, delta: number): Date {
  return new Date(current.getFullYear(), current.getMonth() + delta, 1);
}

export function getToday(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

export { toIsoDate };
