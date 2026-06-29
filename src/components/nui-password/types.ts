import type { NuiType } from '../../types/nui-type.js';

export interface PasswordProps {
  modelValue?: string;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  passwordsMatch?: boolean;
  emptyPassword?: boolean;
  toggleMask?: boolean;
  feedback?: boolean;
  nuiType?: NuiType;
  passwordClass?: string;
}
