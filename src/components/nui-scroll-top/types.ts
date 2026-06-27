export type ScrollTopTarget = 'window' | 'parent';
export type ScrollTopBehavior = 'auto' | 'smooth';

export interface ScrollTopProps {
  target?: ScrollTopTarget;
  threshold?: number;
  icon?: string;
  behavior?: ScrollTopBehavior | string;
  rounded?: boolean;
  scrollContainer?: string;
  unstyled?: boolean;
  scrollTopClass?: string;
}
