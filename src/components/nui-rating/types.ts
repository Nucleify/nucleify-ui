import type { NuiType } from '../../types/nui-type.js';

export interface RatingProps {
  value?: number;
  name?: string;
  stars?: number;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  onIcon?: string;
  offIcon?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
  ratingClass?: string;
}
