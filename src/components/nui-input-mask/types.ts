import type {
  OriginalEventDetail,
  ValueEventDetail,
} from '../../types/component-events.js';
import type { NuiType } from '../../types/nui-type.js';

export type InputMaskSize = 'small' | 'large';

export type InputMaskVariant = 'outlined' | 'filled';

export interface InputMaskProps {
  value?: string;
  mask?: string;
  slotChar?: string;
  autoClear?: boolean;
  unmask?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  name?: string;
  inputId?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  size?: InputMaskSize | '';
  variant?: InputMaskVariant | '';
  fluid?: boolean;
  unstyled?: boolean;
  nuiType?: NuiType;
  inputClass?: string;
}

export interface NuiInputMaskEventMap {
  input: CustomEvent<ValueEventDetail>;
  complete: CustomEvent<OriginalEventDetail>;
}
