import type { ValueEventDetail } from '../../types/component-events.js';
import type { NuiType } from '../../types/nui-type.js';

export type InputTextSize = 'small' | 'large';

export type InputTextVariant = 'outlined' | 'filled' | 'borderless';

export type InputTextType =
  | 'text'
  | 'password'
  | 'email'
  | 'search'
  | 'tel'
  | 'url'
  | 'number';

export interface InputTextProps {
  value?: string;
  type?: InputTextType;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  required?: boolean;
  name?: string;
  inputId?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  autocomplete?: string;
  maxlength?: number;
  minlength?: number;
  size?: InputTextSize | '';
  variant?: InputTextVariant | '';
  fluid?: boolean;
  unstyled?: boolean;
  nuiType?: NuiType;
  inputClass?: string;
}

export interface NuiInputTextEventMap {
  input: CustomEvent<ValueEventDetail>;
  change: CustomEvent<ValueEventDetail>;
}
