import type { OriginalEventDetail } from '../../types/component-events.js';
import type { NuiType } from '../../types/nui-type.js';

export type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

export type ImageLoading = 'lazy' | 'eager';

export type ImageFetchPriority = 'high' | 'low' | 'auto';

export interface ImageProps {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  fit?: ImageFit | '';
  loading?: ImageLoading | '';
  fetchpriority?: ImageFetchPriority | '';
  preview?: boolean;
  imageClass?: string;
  imageStyle?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
}

export interface NuiImageEventMap {
  error: CustomEvent<OriginalEventDetail>;
}
