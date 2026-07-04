import type { ValueEventDetail } from '../../types/component-events.js';
import type { NuiType } from '../../types/nui-type.js';

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export interface SelectProps {
  value?: string;
  options?: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  fluid?: boolean;
  size?: 'small' | '' | 'large';
  variant?: '' | 'filled' | 'borderless';
  selectClass?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
}

export interface NuiSelectEventMap {
  'nui-select-open': CustomEvent;
  'nui-change': CustomEvent<ValueEventDetail>;
}
