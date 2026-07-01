import type { NuiType } from '../../types/nui-type.js';

export type AutoCompletePrimitive = string | number;
export type AutoCompleteSuggestion =
  | AutoCompletePrimitive
  | Record<string, unknown>;
export type AutoCompleteDropdownMode = 'blank' | 'current';
export type AutoCompleteSize = 'small' | 'large';
export type AutoCompleteVariant = 'outlined' | 'filled';

export interface AutoCompleteProps {
  suggestions?: AutoCompleteSuggestion[];
  value?: string;
  optionLabel?: string;
  optionValue?: string;
  optionDisabled?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  readonly?: boolean;
  fluid?: boolean;
  size?: AutoCompleteSize | '';
  variant?: AutoCompleteVariant | '';
  dropdown?: boolean;
  dropdownMode?: AutoCompleteDropdownMode;
  panelScrollHeight?: string;
  minLength?: number;
  forceSelection?: boolean;
  completeOnFocus?: boolean;
  emptyMessage?: string;
  dropdownIcon?: string;
  name?: string;
  inputId?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
  autoCompleteClass?: string;
}
