import type {
  ItemClickEventDetail,
  OriginalEventDetail,
  VisibleChangeEventDetail,
} from '../../types/component-events.js';
import type { NuiType } from '../../types/nui-type.js';

export interface SpeedDialMenuItem {
  label?: string;
  icon?: string;
  command?: (event?: {
    originalEvent?: MouseEvent;
    item?: SpeedDialMenuItem;
  }) => void;
  disabled?: boolean;
  visible?: boolean | (() => boolean);
}

export type SpeedDialDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'up-left'
  | 'up-right'
  | 'down-left'
  | 'down-right';

export type SpeedDialType =
  | 'linear'
  | 'circle'
  | 'semi-circle'
  | 'quarter-circle';

export interface SpeedDialProps {
  model: SpeedDialMenuItem[];
  direction?: SpeedDialDirection;
  type?: SpeedDialType;
  radius?: number;
  transitionDelay?: number;
  mask?: boolean;
  disabled?: boolean;
  visible?: boolean;
  hideOnClickOutside?: boolean;
  rotateAnimation?: boolean;
  buttonClass?: string;
  maskClass?: string;
  speedDialClass?: string;
  showIcon?: string;
  hideIcon?: string;
  ariaLabel?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
}

export interface NuiSpeedDialEventMap {
  show: CustomEvent<OriginalEventDetail>;
  hide: CustomEvent<OriginalEventDetail>;
  change: CustomEvent<VisibleChangeEventDetail>;
  click: CustomEvent<OriginalEventDetail>;
  'item-click': CustomEvent<ItemClickEventDetail<SpeedDialMenuItem>>;
}
