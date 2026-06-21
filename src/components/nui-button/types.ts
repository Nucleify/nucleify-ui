import type { NuiType } from '../../types/nui-type.js';

export type ButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';

export type ButtonSeverity =
  | 'secondary'
  | 'success'
  | 'info'
  | 'warn'
  | 'help'
  | 'danger'
  | 'contrast';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outlined'
  | 'text'
  | 'link';

export type ButtonSize = 'small' | 'large';

export type ButtonType = 'button' | 'submit' | 'reset';

export type BadgeSeverity = ButtonSeverity;

export type ButtonMedia = 'image' | 'icon';

export interface ButtonProps {
  label?: string;
  icon?: string;
  iconPos?: ButtonIconPosition;
  iconClass?: string;
  badge?: string;
  badgeClass?: string;
  badgeSeverity?: BadgeSeverity;
  loading?: boolean;
  loadingIcon?: string;
  link?: boolean;
  severity?: ButtonSeverity;
  raised?: boolean;
  rounded?: boolean;
  text?: boolean;
  outlined?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  plain?: boolean;
  fluid?: boolean;
  unstyled?: boolean;
  disabled?: boolean;
  type?: ButtonType;
  nuiType?: NuiType;
  media?: ButtonMedia;
  alt?: string;
  width?: string;
  height?: string;
  gap?: string;
  padding?: string;
  src?: string;
  class?: string;
  style?: string;
}
