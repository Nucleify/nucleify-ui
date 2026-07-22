import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { normalizeManualInput } from './date-utils.js';
import {
  commitIsoValue,
  getDisplayValue,
  getSelectedDate,
  getToday,
  getVisibleMonth,
  type NuiDatePickerViewState,
  renderDatePicker,
  shiftVisibleMonth,
} from './logic.js';
import type { DatePickerSize, DatePickerVariant } from './types.js';

const styles = createComponentStyles(
  'nui-date-picker',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-date-picker')
export class NuiDatePicker
  extends LitElement
  implements
    Omit<NuiDatePickerViewState, 'displayValue' | 'selectedDate' | 'today'>
{
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = 'Select date';
  @property({ type: String, attribute: 'date-format' }) dateFormat = 'yy-mm-dd';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) fluid = false;
  @property({ type: String, reflect: true }) size: DatePickerSize | '' = '';
  @property({ type: String, reflect: true }) variant: DatePickerVariant | '' =
    '';
  @property({ type: Boolean, attribute: 'show-on-focus' }) showOnFocus = true;
  @property({ type: Boolean, attribute: 'show-icon', reflect: true })
  showIcon = true;
  @property({ type: String }) icon = 'mdi:calendar';
  @property({ type: Boolean, attribute: 'manual-input' }) manualInput = false;
  @property({ type: String }) name = '';
  @property({ type: String, attribute: 'input-id' }) inputId = '';
  @property({ type: String, attribute: 'aria-label' }) ariaLabel = '';
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledby = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'date-picker-class' })
  datePickerClass = '';

  @state() overlayVisible = false;
  @state() visibleMonth = getVisibleMonth('');
  @state() displayValue = '';

  private blurTimer: ReturnType<typeof setTimeout> | null = null;
  private skipBlurClose = false;
  private readonly today = getToday();

  protected createRenderRoot() {
    const root = super.createRenderRoot();
    void styles.sync(root, { unstyled: this.unstyled });
    return root;
  }

  protected firstUpdated() {
    this.syncDisplayValue();
    this.visibleMonth = getVisibleMonth(this.value, this.today);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.clearBlurTimer();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('value') || changed.has('dateFormat')) {
      this.syncDisplayValue();

      if (changed.has('value')) {
        this.visibleMonth = getVisibleMonth(this.value, this.today);
      }
    }
  }

  private syncDisplayValue(): void {
    this.displayValue = getDisplayValue(this.value, this.dateFormat);
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
    this.visibleMonth = getVisibleMonth(this.value, this.today);

    this.dispatchEvent(
      new CustomEvent('show', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private closeOverlay(): void {
    if (!this.overlayVisible) {
      return;
    }

    this.overlayVisible = false;

    this.dispatchEvent(
      new CustomEvent('hide', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private commitValue(nextValue: string, event?: Event): void {
    const normalized = commitIsoValue(nextValue);

    if (this.value === normalized) {
      this.syncDisplayValue();
      return;
    }

    this.value = normalized;
    this.syncDisplayValue();
    this.visibleMonth = getVisibleMonth(this.value, this.today);

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value, originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleInput = (event: Event): void => {
    if (!this.manualInput) {
      return;
    }

    const input = event.target as HTMLInputElement;
    this.displayValue = input.value;

    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: this.displayValue },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private handleChange = (event: Event): void => {
    if (!this.manualInput) {
      return;
    }

    const input = event.target as HTMLInputElement;
    this.commitValue(normalizeManualInput(input.value), event);
  };

  private handleFocus = (): void => {
    if (this.showOnFocus) {
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

      this.closeOverlay();
    }, 120);
  };

  private handleIconMouseDown = (event: Event): void => {
    event.preventDefault();
    this.skipBlurClose = true;
  };

  private handleIconClick = (event: Event): void => {
    event.preventDefault();

    if (this.overlayVisible) {
      this.closeOverlay();
      return;
    }

    this.openOverlay();
  };

  private handlePanelMouseDown = (event: Event): void => {
    event.preventDefault();
    this.skipBlurClose = true;
  };

  private handlePrevMonth = (event: Event): void => {
    event.preventDefault();
    this.visibleMonth = shiftVisibleMonth(this.visibleMonth, -1);
  };

  private handleNextMonth = (event: Event): void => {
    event.preventDefault();
    this.visibleMonth = shiftVisibleMonth(this.visibleMonth, 1);
  };

  private handleDayClick = (iso: string, event: Event): void => {
    event.preventDefault();
    this.commitValue(iso, event);
    this.closeOverlay();
  };

  render() {
    return renderDatePicker(
      {
        value: this.value,
        displayValue: this.displayValue,
        placeholder: this.placeholder,
        disabled: this.disabled,
        readonly: this.readonly,
        invalid: this.invalid,
        required: this.required,
        fluid: this.fluid,
        size: this.size,
        variant: this.variant,
        showIcon: this.showIcon,
        icon: this.icon,
        manualInput: this.manualInput,
        name: this.name,
        inputId: this.inputId,
        ariaLabel: this.ariaLabel,
        ariaLabelledby: this.ariaLabelledby,
        overlayVisible: this.overlayVisible,
        visibleMonth: this.visibleMonth,
        selectedDate: getSelectedDate(this.value),
        today: this.today,
        nuiType: this.nuiType,
        datePickerClass: this.datePickerClass,
      },
      {
        onInput: this.handleInput,
        onChange: this.handleChange,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onIconClick: this.handleIconClick,
        onIconMouseDown: this.handleIconMouseDown,
        onPrevMonth: this.handlePrevMonth,
        onNextMonth: this.handleNextMonth,
        onDayClick: this.handleDayClick,
        onPanelMouseDown: this.handlePanelMouseDown,
      },
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-date-picker': NuiDatePicker;
  }
}
