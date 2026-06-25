import type { NuiType } from '../../types/nui-type.js';

export type TextareaSize = 'small' | 'large';

export type TextareaVariant = 'outlined' | 'filled';

export interface TextareaProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  required?: boolean;
  name?: string;
  textareaId?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  autocomplete?: string;
  maxlength?: number;
  minlength?: number;
  rows?: number;
  cols?: number;
  autoResize?: boolean;
  size?: TextareaSize | '';
  variant?: TextareaVariant | '';
  fluid?: boolean;
  unstyled?: boolean;
  nuiType?: NuiType;
  textareaClass?: string;
}
