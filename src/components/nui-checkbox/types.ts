import type { NuiType } from '../../types/nui-type.js';

export type CheckboxSize = 'small' | 'large';

export interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  invalid?: boolean;
  size?: CheckboxSize | '';
  name?: string;
  value?: string;
  readonly?: boolean;
  required?: boolean;
  inputId?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
  checkboxClass?: string;
}
