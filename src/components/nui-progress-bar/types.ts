import type { NuiType } from '../../types/nui-type.js';

export type ProgressBarMode = 'determinate' | 'indeterminate';

export interface ProgressBarProps {
  value?: number;
  mode?: ProgressBarMode;
  showValue?: boolean;
  width?: string;
  height?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
  progressBarClass?: string;
}
