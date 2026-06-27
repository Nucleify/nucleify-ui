import type { NuiType } from '../../types/nui-type.js';
import type { ImageFetchPriority } from '../nui-image/types.js';

export type AnchorRel =
  | ''
  | 'alternate'
  | 'author'
  | 'bookmark'
  | 'external'
  | 'help'
  | 'license'
  | 'next'
  | 'nofollow'
  | 'noreferrer'
  | 'noopener'
  | 'prev'
  | 'search'
  | 'tag';

export type AnchorTarget = '' | '_blank' | '_parent' | '_self' | '_top';

export interface AnchorProps {
  href?: string;
  rel?: AnchorRel;
  target?: AnchorTarget;
  icon?: string;
  size?: string;
  src?: string;
  alt?: string;
  label?: string;
  tooltip?: string;
  fetchpriority?: ImageFetchPriority | '';
  anchorClass?: string;
  itemClass?: string;
  anchorStyle?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
}
