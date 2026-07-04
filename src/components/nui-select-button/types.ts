import type { ValueChangeEventDetail } from '../../types/component-events.js';
import type { NuiType } from '../../types/nui-type.js';

export type SelectButtonPrimitive = string | number;
export type SelectButtonOption =
  | SelectButtonPrimitive
  | Record<string, unknown>;
export type SelectButtonValue =
  | SelectButtonPrimitive
  | SelectButtonPrimitive[]
  | null;
export type SelectButtonSize = 'small' | 'large';

export interface SelectButtonProps {
  options?: SelectButtonOption[];
  optionLabel?: string;
  optionValue?: string;
  optionDisabled?: string;
  optionIcon?: string;
  value?: SelectButtonValue;
  multiple?: boolean;
  allowEmpty?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  fluid?: boolean;
  size?: SelectButtonSize | '';
  dataKey?: string;
  ariaLabelledby?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
  selectButtonClass?: string;
}

export interface NuiSelectButtonEventMap {
  change: CustomEvent<ValueChangeEventDetail<SelectButtonValue>>;
}
