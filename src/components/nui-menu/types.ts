import type { NuiType } from '../../types/nui-type.js';

export interface MenuItem {
  label?: string;
  icon?: string;
  url?: string;
  target?: string;
  disabled?: boolean;
  visible?: boolean;
  separator?: boolean;
  command?: (event: { originalEvent: Event; item: MenuItem }) => void;
}

export interface MenuProps {
  model?: MenuItem[];
  popup?: boolean;
  disabled?: boolean;
  unstyled?: boolean;
  nuiType?: NuiType;
  menuClass?: string;
}
