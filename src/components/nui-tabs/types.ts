import type { ValueEventDetail } from '../../types/component-events.js';
import type { NuiType } from '../../types/nui-type.js';

export interface TabListInterface {
  value: string | number;
  header?: string;
}

export interface TabPanelInterface {
  value: string | number;
  content?: string;
}

export interface TabsProps {
  lists?: TabListInterface[];
  panels?: TabPanelInterface[];
  value?: string | number;
  unstyled?: boolean;
  nuiType?: NuiType;
}

export interface NuiTabsViewState extends TabsProps {
  activeValue: string | number;
}

export interface NuiTabsEventMap {
  'nui-change': CustomEvent<ValueEventDetail<string | number>>;
}
