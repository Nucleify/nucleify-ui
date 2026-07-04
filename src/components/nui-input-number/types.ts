import type { ValueEventDetail } from '../../types/component-events.js';
import type { NuiType } from '../../types/nui-type.js';

export type InputNumberSize = 'small' | 'large';
export type InputNumberVariant = 'outlined' | 'filled';
export type InputNumberButtonLayout = 'stacked' | 'horizontal' | 'vertical';
export type InputNumberMode = 'decimal' | 'currency';

export interface InputNumberProps {
  value?: number | null;
  min?: number | null;
  max?: number | null;
  step?: number;
  format?: boolean;
  showButtons?: boolean;
  buttonLayout?: InputNumberButtonLayout;
  mode?: InputNumberMode;
  locale?: string;
  currency?: string;
  useGrouping?: boolean;
  minFractionDigits?: number;
  maxFractionDigits?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  required?: boolean;
  allowEmpty?: boolean;
  size?: InputNumberSize | '';
  variant?: InputNumberVariant | '';
  fluid?: boolean;
  unstyled?: boolean;
  nuiType?: NuiType;
  inputClass?: string;
  name?: string;
  inputId?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  incrementIcon?: string;
  decrementIcon?: string;
}

export interface NuiInputNumberEventMap {
  input: CustomEvent<ValueEventDetail<number | null>>;
  change: CustomEvent<ValueEventDetail<number | null>>;
}
