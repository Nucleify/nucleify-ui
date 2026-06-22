import type { NuiType } from '../../types/nui-type.js';
import type { ButtonSeverity } from '../nui-button/types.js';

export type TagSeverity = ButtonSeverity;

export interface TagProps {
  value?: string;
  severity?: TagSeverity | '';
  rounded?: boolean;
  icon?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
  tagClass?: string;
}
