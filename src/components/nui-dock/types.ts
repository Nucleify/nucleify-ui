export type DockPosition = 'top' | 'bottom' | 'left' | 'right';

export interface DockItem {
  icon?: string;
  label?: string;
  url?: string;
  class?: string;
  adType?: string;
  click?: (e: MouseEvent) => void;
  logo?: boolean;
}
