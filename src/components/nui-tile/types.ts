import type { NuiType } from '../../types/nui-type.js';

export interface TileProps {
  href?: string;
  header?: string;
  count?: string | number;
  countSecondary?: number | string;
  textSecondary?: string;
  icon?: string;
  tileClass?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
}
