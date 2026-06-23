import type { NuiType } from '../../types/nui-type.js';

export type AvatarSize = 'large' | 'xlarge';

export type AvatarShape = 'square' | 'circle';

export interface AvatarProps {
  label?: string;
  icon?: string;
  image?: string;
  size?: AvatarSize | '';
  shape?: AvatarShape | '';
  ariaLabel?: string;
  ariaLabelledby?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
  avatarClass?: string;
}
