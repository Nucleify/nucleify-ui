import type { NuiType } from '../../types/nui-type.js';

export type ListboxPrimitive = string | number;
export type ListboxOption = ListboxPrimitive | Record<string, unknown>;
export type ListboxValue = ListboxPrimitive | ListboxPrimitive[] | null;

export interface ListboxProps {
  options?: ListboxOption[];
  optionLabel?: string;
  optionValue?: string;
  optionDisabled?: string;
  value?: ListboxValue;
  multiple?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  readonly?: boolean;
  filter?: boolean;
  filterPlaceholder?: string;
  scrollHeight?: string;
  striped?: boolean;
  checkmark?: boolean;
  highlightOnSelect?: boolean;
  emptyMessage?: string;
  emptyFilterMessage?: string;
  fluid?: boolean;
  tabindex?: number;
  ariaLabel?: string;
  ariaLabelledby?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
  listboxClass?: string;
}
