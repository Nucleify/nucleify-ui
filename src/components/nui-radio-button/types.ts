import type { CheckedValueEventDetail } from '../../types/component-events.js';
import type { NuiType } from '../../types/nui-type.js';

export type RadioButtonSize = 'small' | 'large';
export type RadioButtonVariant = 'outlined' | 'filled';

export interface RadioButtonProps {
  checked?: boolean;
  value?: string;
  name?: string;
  binary?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  readonly?: boolean;
  size?: RadioButtonSize | '';
  variant?: RadioButtonVariant | '';
  tabindex?: number;
  inputId?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
  radioButtonClass?: string;
}

export interface NuiRadioButtonEventMap {
  change: CustomEvent<CheckedValueEventDetail<string | boolean>>;
}
