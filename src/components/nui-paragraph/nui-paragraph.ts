import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiParagraphViewState, renderParagraph } from './logic.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-paragraph')
export class NuiParagraph extends LitElement implements NuiParagraphViewState {
  @property({ type: String }) text = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'paragraph-class' })
  paragraphClass = '';

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  render() {
    return renderParagraph(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-paragraph': NuiParagraph;
  }
}
