import type { NuiType } from '../../types/nui-type.js';

export interface KnobProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  valueTemplate?: string;
  valueColor?: string;
  rangeColor?: string;
  textColor?: string;
  readonly?: boolean;
  disabled?: boolean;
  tabindex?: number;
  ariaLabel?: string;
  ariaLabelledby?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
  knobClass?: string;
}
