export type DialogPosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topleft'
  | 'topright'
  | 'bottomleft'
  | 'bottomright';

export interface DialogProps {
  visible?: boolean;
  header?: string;
  footer?: string;
  modal?: boolean;
  closable?: boolean;
  closeOnEscape?: boolean;
  dismissableMask?: boolean;
  position?: DialogPosition;
  width?: string;
  dialogClass?: string;
  unstyled?: boolean;
}
