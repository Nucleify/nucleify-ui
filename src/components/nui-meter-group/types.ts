import type { NuiType } from '../../types/nui-type.js';

export interface MeterItem {
  label?: string;
  value: number;
  color?: string;
  icon?: string;
}

export interface MeterGroupProps {
  value?: MeterItem[];
  min?: number;
  max?: number;
  orientation?: 'horizontal' | 'vertical';
  labelPosition?: 'start' | 'end' | 'none';
  labelOrientation?: 'horizontal' | 'vertical';
  unstyled?: boolean;
  nuiType?: NuiType;
  meterGroupClass?: string;
}
