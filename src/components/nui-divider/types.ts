import type { NuiType } from '../../types/nui-type.js';

export type DividerLayout = 'horizontal' | 'vertical';

export type DividerAlign = 'left' | 'center' | 'right' | 'top' | 'bottom';

export type DividerType = 'solid' | 'dashed' | 'dotted';

export interface DividerProps {
  layout?: DividerLayout | '';
  align?: DividerAlign | '';
  type?: DividerType | '';
  unstyled?: boolean;
  nuiType?: NuiType;
  dividerClass?: string;
}
