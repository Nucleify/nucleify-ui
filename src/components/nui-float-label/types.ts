import type { NuiType } from '../../types/nui-type.js';

export type FloatLabelVariant = 'over' | 'in' | 'on';

export interface FloatLabelProps {
  variant?: FloatLabelVariant;
  fluid?: boolean;
  unstyled?: boolean;
  nuiType?: NuiType;
  floatLabelClass?: string;
}
