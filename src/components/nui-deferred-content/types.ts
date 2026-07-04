import type { OriginalEventDetail } from '../../types/component-events.js';

export interface DeferredContentProps {
  scrollContainer?: string;
  deferredContentClass?: string;
  unstyled?: boolean;
}

export interface NuiDeferredContentEventMap {
  load: CustomEvent<OriginalEventDetail>;
}
