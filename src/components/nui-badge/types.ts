import type { NuiType } from '../../types/nui-type.js';
import type { BadgeSeverity } from '../nui-button/types.js';

export type { BadgeSeverity };

export type BadgeSize = 'small' | 'large' | 'xlarge';

export interface BadgeProps {
  value?: string;
  severity?: BadgeSeverity | '';
  size?: BadgeSize | '';
  unstyled?: boolean;
  nuiType?: NuiType;
  badgeClass?: string;
}
