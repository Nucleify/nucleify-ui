import type { NuiType } from '../../types/nui-type.js';

export interface PopoverProps {
  buttonText?: string;
  icon?: string;
  src?: string;
  buttonClass?: string;
  buttonStyle?: string;
  popoverClass?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  nuiType?: NuiType;
}
