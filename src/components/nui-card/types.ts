import type { NuiType } from '../../types/nui-type.js';

export interface CardProps {
  title?: string;
  subtitle?: string;
  cardClass?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
}
