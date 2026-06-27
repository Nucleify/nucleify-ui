import type { NuiType } from '../../types/nui-type.js';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps {
  tag?: number;
  text?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
  headingClass?: string;
}
