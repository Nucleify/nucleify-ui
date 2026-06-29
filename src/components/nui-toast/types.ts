import type { NuiType } from '../../types/nui-type.js';

export interface ToastMessage {
  id?: string;
  severity?: 'success' | 'info' | 'warn' | 'error';
  summary?: string;
  detail?: string;
  life?: number;
  closing?: boolean; // track transition state for slide-out animation
}

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface ToastProps {
  position?: ToastPosition;
  unstyled?: boolean;
  nuiType?: NuiType;
}

export interface NuiToastViewState extends ToastProps {
  messages: ToastMessage[];
}
