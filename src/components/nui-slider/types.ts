import type { NuiType } from '../../types/nui-type.js';

export type SliderOrientation = 'horizontal' | 'vertical';

export type SliderValue = number | [number, number];

export interface SliderProps {
  value?: number;
  valueHigh?: number;
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  orientation?: SliderOrientation;
  disabled?: boolean;
  tabindex?: number;
  ariaLabel?: string;
  ariaLabelledby?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
  sliderClass?: string;
}
