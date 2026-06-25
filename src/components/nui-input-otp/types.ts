import type { NuiType } from '../../types/nui-type.js';

export type InputOtpSize = 'small' | 'large';
export type InputOtpVariant = 'outlined' | 'filled';

export interface InputOtpProps {
  value?: string;
  length?: number;
  mask?: boolean;
  integerOnly?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  tabindex?: number;
  size?: InputOtpSize | '';
  variant?: InputOtpVariant | '';
  fluid?: boolean;
  unstyled?: boolean;
  nuiType?: NuiType;
  otpClass?: string;
  inputClass?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
}
