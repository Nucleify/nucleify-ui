import type { NuiType } from '../../types/nui-type.js';

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps {
  value?: string;
  disabled?: boolean;
  tooltipId?: string;
  tooltipClass?: string;
  escape?: boolean;
  fitContent?: boolean;
  showDelay?: number;
  hideDelay?: number;
  autoHide?: boolean;
  position?: TooltipPosition;
  unstyled?: boolean;
  nuiType?: NuiType;
}
