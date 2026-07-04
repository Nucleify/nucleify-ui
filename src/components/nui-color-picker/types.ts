import type {
  ValueChangeEventDetail,
  ValueEventDetail,
} from '../../types/component-events.js';

export type ColorFormat = 'hex' | 'rgb' | 'hsb';

export interface ColorRgb {
  r: number;
  g: number;
  b: number;
}

export interface ColorHsb {
  h: number;
  s: number;
  b: number;
}

export type ColorValue = string | ColorRgb | ColorHsb;

export interface ColorPickerProps {
  value?: ColorValue;
  defaultColor?: string;
  format?: ColorFormat;
  inline?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  inputId?: string;
  tabindex?: number;
  colorPickerClass?: string;
  unstyled?: boolean;
}

export interface NuiColorPickerEventMap {
  hide: CustomEvent;
  show: CustomEvent;
  input: CustomEvent<ValueEventDetail<ColorValue>>;
  change: CustomEvent<ValueChangeEventDetail<ColorValue>>;
}
