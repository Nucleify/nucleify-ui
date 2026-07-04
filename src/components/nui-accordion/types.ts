import type { ValueChangeEventDetail } from '../../types/component-events.js';

export type AccordionPanelValue = string | number;

export interface AccordionPanel {
  index: AccordionPanelValue;
  content: string;
  answer: string;
}

export type AccordionValue = AccordionPanelValue | AccordionPanelValue[] | null;

export interface AccordionProps {
  panels?: AccordionPanel[];
  value?: AccordionValue;
  multiple?: boolean;
  lazy?: boolean;
  expandIcon?: string;
  collapseIcon?: string;
  tabindex?: number;
  selectOnFocus?: boolean;
  accordionClass?: string;
  unstyled?: boolean;
  nuiType?: string;
}

export interface NuiAccordionEventMap {
  change: CustomEvent<ValueChangeEventDetail<AccordionValue>>;
}
