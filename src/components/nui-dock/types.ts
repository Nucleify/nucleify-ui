import type { ItemClickEventDetail } from '../../types/component-events.js';

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

export interface NuiDockEventMap {
  'item-click': CustomEvent<ItemClickEventDetail<DockItem>>;
}
