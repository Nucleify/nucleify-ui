import type { NuiType } from '../../types/nui-type.js';

export type SkeletonShape = 'rectangle' | 'circle';

export type SkeletonAnimation = 'wave' | 'none';

export interface SkeletonProps {
  shape?: SkeletonShape | '';
  size?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  animation?: SkeletonAnimation | '';
  unstyled?: boolean;
  nuiType?: NuiType;
  skeletonClass?: string;
}
