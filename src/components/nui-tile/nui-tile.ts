import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiTileViewState, renderTile } from './logic.js';

const styles = createComponentStyles(
  'nui-tile',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-tile')
export class NuiTile extends LitElement implements NuiTileViewState {
  @property({ type: String }) href = '#';
  @property({ type: String }) header = '';
  @property({ type: String }) count = '';
  @property({ type: String, attribute: 'count-secondary' })
  countSecondary = '';
  @property({ type: String, attribute: 'text-secondary' })
  textSecondary = '';
  @property({ type: String }) icon = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'tile-class' }) tileClass = '';

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
    return renderTile(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-tile': NuiTile;
  }
}
