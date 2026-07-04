import type { CommandEventDetail } from '../../types/component-events.js';
import type { NuiType } from '../../types/nui-type.js';

export interface TerminalHistoryItem {
  command: string;
  response?: string;
}

export interface TerminalProps {
  welcomeMessage?: string;
  prompt?: string;
  unstyled?: boolean;
  nuiType?: NuiType;
}

export interface NuiTerminalViewState extends TerminalProps {
  history: TerminalHistoryItem[];
}

export interface NuiTerminalEventMap {
  'nui-command': CustomEvent<CommandEventDetail>;
}
