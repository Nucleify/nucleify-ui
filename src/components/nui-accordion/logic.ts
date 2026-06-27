import '../nui-icon/nui-icon.js';
import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import { isPanelOpen } from './accordion-value.js';
import type { AccordionPanel, AccordionValue } from './types.js';

export interface NuiAccordionViewState {
  panels: AccordionPanel[];
  value: AccordionValue;
  multiple: boolean;
  lazy: boolean;
  lazyOpened: Set<string>;
  expandIcon: string;
  collapseIcon: string;
  tabindex: number;
  accordionClass: string;
  nuiType: NuiType;
}

export interface AccordionRenderHandlers {
  onHeaderClick: (panelValue: AccordionPanel['index'], event: Event) => void;
  onHeaderFocus: (panelValue: AccordionPanel['index'], event: Event) => void;
}

export function getAccordionClass(accordionClass: string): string {
  return ['nui-accordion', accordionClass].filter(Boolean).join(' ');
}

function shouldRenderPanelContent(
  state: NuiAccordionViewState,
  panelValue: AccordionPanel['index'],
  expanded: boolean,
): boolean {
  if (!state.lazy) {
    return true;
  }

  const key = String(panelValue);

  return expanded || state.lazyOpened.has(key);
}

export function renderAccordion(
  state: NuiAccordionViewState,
  handlers: AccordionRenderHandlers,
): TemplateResult {
  return html`
    <div
      class=${getAccordionClass(state.accordionClass)}
      nui-type=${state.nuiType || nothing}
    >
      ${state.panels.map((panel) => {
        const expanded = isPanelOpen(state.value, panel.index, state.multiple);
        const icon = expanded
          ? state.collapseIcon || state.expandIcon
          : state.expandIcon;
        const contentId = `accordion-content-${String(panel.index)}`;
        const headerId = `accordion-header-${String(panel.index)}`;
        const renderContent = shouldRenderPanelContent(
          state,
          panel.index,
          expanded,
        );

        return html`
          <div
            class="nui-accordion-panel"
            ?expanded=${expanded}
          >
            <h3 class="nui-accordion-header">
              <button
                type="button"
                class="nui-accordion-header-button"
                id=${headerId}
                aria-expanded=${expanded ? 'true' : 'false'}
                aria-controls=${contentId}
                tabindex=${state.tabindex}
                @click=${(event: Event) =>
                  handlers.onHeaderClick(panel.index, event)}
                @focus=${(event: Event) =>
                  handlers.onHeaderFocus(panel.index, event)}
              >
                <span class="nui-accordion-header-label">${panel.content}</span>
                ${
                  icon
                    ? html`
                        <nui-icon
                          class="nui-accordion-toggle-icon"
                          icon=${icon}
                          width="1.25em"
                          height="1.25em"
                          aria-hidden="true"
                        ></nui-icon>
                      `
                    : nothing
                }
              </button>
            </h3>
            ${
              renderContent
                ? html`
                    <div
                      id=${contentId}
                      class="nui-accordion-content"
                      role="region"
                      aria-labelledby=${headerId}
                      ?hidden=${!expanded}
                    >
                      ${panel.answer}
                    </div>
                  `
                : nothing
            }
          </div>
        `;
      })}
      <slot></slot>
    </div>
  `;
}
