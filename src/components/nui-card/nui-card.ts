import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { slotHasContent } from './card-slots.js';
import { type NuiCardViewState, renderCard } from './logic.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-card')
export class NuiCard extends LitElement implements NuiCardViewState {
  @property({ type: String }) title = '';
  @property({ type: String }) subtitle = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'card-class' }) cardClass = '';

  @state() hasHeader = false;
  @state() hasTitleSlot = false;
  @state() hasSubtitleSlot = false;
  @state() hasFooter = false;

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  private handleHeaderSlotChange = (event: Event): void => {
    this.hasHeader = slotHasContent(event.target as HTMLSlotElement);
  };

  private handleTitleSlotChange = (event: Event): void => {
    this.hasTitleSlot = slotHasContent(event.target as HTMLSlotElement);
  };

  private handleSubtitleSlotChange = (event: Event): void => {
    this.hasSubtitleSlot = slotHasContent(event.target as HTMLSlotElement);
  };

  private handleFooterSlotChange = (event: Event): void => {
    this.hasFooter = slotHasContent(event.target as HTMLSlotElement);
  };

  render() {
    return renderCard(this, {
      onHeaderSlotChange: this.handleHeaderSlotChange,
      onTitleSlotChange: this.handleTitleSlotChange,
      onSubtitleSlotChange: this.handleSubtitleSlotChange,
      onFooterSlotChange: this.handleFooterSlotChange,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-card': NuiCard;
  }
}
