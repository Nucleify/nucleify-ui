export type DatePickerSize = 'small' | 'large';
export type DatePickerVariant = 'outlined' | 'filled';

export interface DatePickerProps {
  value?: string;
  placeholder?: string;
  dateFormat?: string;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  required?: boolean;
  fluid?: boolean;
  size?: DatePickerSize | '';
  variant?: DatePickerVariant | '';
  showOnFocus?: boolean;
  showIcon?: boolean;
  icon?: string;
  manualInput?: boolean;
  name?: string;
  inputId?: string;
  datePickerClass?: string;
  unstyled?: boolean;
}

export interface CalendarDay {
  date: Date;
  inMonth: boolean;
  iso: string;
}
