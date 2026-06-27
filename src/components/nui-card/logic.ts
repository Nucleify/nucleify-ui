import '../nui-heading/nui-heading.js';
import '../nui-paragraph/nui-paragraph.js';
import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';

export interface NuiCardViewState {
  title: string;
  subtitle: string;
  cardClass: string;
  nuiType: NuiType;
  hasHeader: boolean;
  hasTitleSlot: boolean;
  hasSubtitleSlot: boolean;
  hasFooter: boolean;
}

export interface CardRenderHandlers {
  onHeaderSlotChange: (event: Event) => void;
  onTitleSlotChange: (event: Event) => void;
  onSubtitleSlotChange: (event: Event) => void;
  onFooterSlotChange: (event: Event) => void;
}

export function getCardClass(cardClass: string): string {
  return ['nui-card', cardClass].filter(Boolean).join(' ');
}

function shouldShowCaption(state: NuiCardViewState): boolean {
  return Boolean(
    state.title ||
      state.subtitle ||
      state.hasTitleSlot ||
      state.hasSubtitleSlot,
  );
}

export function renderCard(
  state: NuiCardViewState,
  handlers: CardRenderHandlers,
): TemplateResult {
  const showCaption = shouldShowCaption(state);

  return html`
    <div
      class=${getCardClass(state.cardClass)}
      nui-type=${state.nuiType || nothing}
    >
      <div class="nui-card-header" ?hidden=${!state.hasHeader}>
        <slot name="header" @slotchange=${handlers.onHeaderSlotChange}></slot>
      </div>
      <div class="nui-card-body">
        <div class="nui-card-caption" ?hidden=${!showCaption}>
          <div class="nui-card-title">
            <slot name="title" @slotchange=${handlers.onTitleSlotChange}>
              ${
                state.title
                  ? html`
                      <nui-heading
                        class="nui-card-title-text"
                        tag="3"
                        text=${state.title}
                        nui-type=${state.nuiType || nothing}
                        unstyled
                      ></nui-heading>
                    `
                  : nothing
              }
            </slot>
          </div>
          <div class="nui-card-subtitle">
            <slot name="subtitle" @slotchange=${handlers.onSubtitleSlotChange}>
              ${
                state.subtitle
                  ? html`
                      <nui-paragraph
                        class="nui-card-subtitle-text"
                        text=${state.subtitle}
                        nui-type=${state.nuiType || nothing}
                        unstyled
                      ></nui-paragraph>
                    `
                  : nothing
              }
            </slot>
          </div>
        </div>
        <div class="nui-card-content">
          <slot></slot>
        </div>
      </div>
      <div class="nui-card-footer" ?hidden=${!state.hasFooter}>
        <slot name="footer" @slotchange=${handlers.onFooterSlotChange}></slot>
      </div>
    </div>
  `;
}
