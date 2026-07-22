import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiScrollPanelViewState, renderScrollPanel } from './logic.js';

const styles = createComponentStyles(
  'nui-scroll-panel',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-scroll-panel')
export class NuiScrollPanel
  extends LitElement
  implements NuiScrollPanelViewState
{
  @property({ type: Boolean }) unstyled = false;
  @property({ type: String, attribute: 'scroll-panel-class' })
  scrollPanelClass = '';
  @nuiTypeProperty nuiType: NuiType = '';

  connectedCallback() {
    super.connectedCallback();
    // Structural styles applied as inline so they persist even when unstyled=true
    this.style.display = 'block';
    this.style.overflow = 'hidden';
    this.style.width = '100%';
    this.style.height = '100%';
  }

  protected createRenderRoot() {
    const root = super.createRenderRoot();
    void styles.sync(root, { unstyled: this.unstyled });
    return root;
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  render() {
    return renderScrollPanel(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-scroll-panel': NuiScrollPanel;
  }
}
