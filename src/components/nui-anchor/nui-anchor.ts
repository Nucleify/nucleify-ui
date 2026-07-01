import '../nui-icon/nui-icon.js';
import '../nui-image/nui-image.js';
import '../nui-label/nui-label.js';
import '../nui-tooltip/nui-tooltip.js';
import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import type { ImageFetchPriority } from '../nui-image/types.js';
import { type NuiAnchorViewState, renderAnchor } from './logic.js';
import type { AnchorRel, AnchorTarget } from './types.js';

const styles = createComponentStyles(
  'nui-anchor',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-anchor')
export class NuiAnchor extends LitElement implements NuiAnchorViewState {
  @property({ type: String }) href = '#';
  @property({ type: String }) rel: AnchorRel = '';
  @property({ type: String }) target: AnchorTarget = '';
  @property({ type: String }) icon = '';
  @property({ type: String }) size = '';
  @property({ type: String }) src = '';
  @property({ type: String }) alt = '';
  @property({ type: String }) label = '';
  @property({ type: String }) tooltip = '';
  @property({ type: String }) fetchpriority: ImageFetchPriority | '' = '';
  @property({ type: String, attribute: 'anchor-class' }) anchorClass = '';
  @property({ type: String, attribute: 'item-class' }) itemClass = '';
  @property({ type: String, attribute: 'anchor-style' }) anchorStyle = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  render() {
    return renderAnchor(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-anchor': NuiAnchor;
  }
}
