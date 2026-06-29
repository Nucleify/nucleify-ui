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
  variant?: '' | 'filled';
  selectClass?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
}
