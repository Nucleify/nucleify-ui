import '../nui-icon/nui-icon.js';
import { html, nothing, type TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';
import type { NuiType } from '../../types/nui-type.js';
import {
  buildCalendarDays,
  formatDisplayDate,
  getDecadeRange,
  getMonthName,
  getShortMonthLabels,
  getWeekdayLabels,
  parseIsoDate,
  toIsoDate,
} from './date-utils.js';
import type {
  DatePickerCalendarView,
  DatePickerSize,
  DatePickerVariant,
} from './types.js';

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
  currentView: DatePickerCalendarView;
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
  onPrev: (event: Event) => void;
  onNext: (event: Event) => void;
  onToggleMonthView: (event: Event) => void;
  onToggleYearView: (event: Event) => void;
  onDayClick: (iso: string, event: Event) => void;
  onMonthSelect: (monthIndex: number, event: Event) => void;
  onYearSelect: (year: number, event: Event) => void;
  onPanelMouseDown: (event: Event) => void;
}

export function getDatePickerClass(datePickerClass: string): string {
  return ['nui-date-picker', datePickerClass].filter(Boolean).join(' ');
}

function renderHeaderTitle(
  state: NuiDatePickerViewState,
  handlers: DatePickerRenderHandlers,
): TemplateResult {
  const year = state.visibleMonth.getFullYear();

  if (state.currentView === 'year') {
    const decade = getDecadeRange(year);

    return html`
      <div class="nui-date-picker-title">
        <button
          type="button"
          class="nui-date-picker-title-btn"
          aria-label="Back to calendar"
          @click=${handlers.onToggleYearView}
        >
          ${decade.start} – ${decade.end}
        </button>
      </div>
    `;
  }

  if (state.currentView === 'month') {
    return html`
      <div class="nui-date-picker-title">
        <button
          type="button"
          class="nui-date-picker-title-btn"
          aria-label="Choose year"
          @click=${handlers.onToggleYearView}
        >
          ${year}
        </button>
      </div>
    `;
  }

  return html`
    <div class="nui-date-picker-title">
      <button
        type="button"
        class="nui-date-picker-title-btn"
        aria-label="Choose month"
        @click=${handlers.onToggleMonthView}
      >
        ${getMonthName(state.visibleMonth)}
      </button>
      <button
        type="button"
        class="nui-date-picker-title-btn"
        aria-label="Choose year"
        @click=${handlers.onToggleYearView}
      >
        ${year}
      </button>
    </div>
  `;
}

function renderCalendarBody(
  state: NuiDatePickerViewState,
  handlers: DatePickerRenderHandlers,
): TemplateResult {
  const visibleYear = state.visibleMonth.getFullYear();

  if (state.currentView === 'month') {
    const months = getShortMonthLabels();

    return html`
      <div class="nui-date-picker-months">
        ${months.map((label, index) => {
          const selected = state.selectedDate
            ? state.selectedDate.getFullYear() === visibleYear &&
              state.selectedDate.getMonth() === index
            : state.visibleMonth.getMonth() === index;
          const today =
            state.today.getFullYear() === visibleYear &&
            state.today.getMonth() === index;

          return html`
            <button
              type="button"
              class="nui-date-picker-cell"
              ?selected=${selected || nothing}
              ?today=${today || nothing}
              @click=${(event: Event) => handlers.onMonthSelect(index, event)}
            >
              ${label}
            </button>
          `;
        })}
      </div>
    `;
  }

  if (state.currentView === 'year') {
    const decade = getDecadeRange(visibleYear);

    return html`
      <div class="nui-date-picker-years">
        ${decade.years.map((year) => {
          const selected = state.selectedDate
            ? state.selectedDate.getFullYear() === year
            : visibleYear === year;
          const today = state.today.getFullYear() === year;

          return html`
            <button
              type="button"
              class="nui-date-picker-cell"
              ?selected=${selected || nothing}
              ?today=${today || nothing}
              @click=${(event: Event) => handlers.onYearSelect(year, event)}
            >
              ${year}
            </button>
          `;
        })}
      </div>
    `;
  }

  const days = buildCalendarDays(state.visibleMonth);
  const weekdays = getWeekdayLabels();

  return html`
    <div class="nui-date-picker-weekdays">
      ${weekdays.map(
        (label) => html`<span class="nui-date-picker-weekday">${label}</span>`,
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
  `;
}

function renderCalendar(
  state: NuiDatePickerViewState,
  handlers: DatePickerRenderHandlers,
): TemplateResult {
  const prevLabel =
    state.currentView === 'year'
      ? 'Previous decade'
      : state.currentView === 'month'
        ? 'Previous year'
        : 'Previous month';
  const nextLabel =
    state.currentView === 'year'
      ? 'Next decade'
      : state.currentView === 'month'
        ? 'Next year'
        : 'Next month';

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
          aria-label=${prevLabel}
          @click=${handlers.onPrev}
        >
          <nui-icon
            icon="mdi:chevron-left"
            width="1.25em"
            height="1.25em"
            aria-hidden="true"
          ></nui-icon>
        </button>
        ${renderHeaderTitle(state, handlers)}
        <button
          type="button"
          class="nui-date-picker-nav"
          aria-label=${nextLabel}
          @click=${handlers.onNext}
        >
          <nui-icon
            icon="mdi:chevron-right"
            width="1.25em"
            height="1.25em"
            aria-hidden="true"
          ></nui-icon>
        </button>
      </div>
      ${renderCalendarBody(state, handlers)}
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
          .value=${live(state.displayValue)}
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
                    class="nui-date-picker-trigger-icon"
                    icon=${state.icon}
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

export function shiftVisibleYear(current: Date, delta: number): Date {
  return new Date(current.getFullYear() + delta, current.getMonth(), 1);
}

export function getToday(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

export { toIsoDate };
