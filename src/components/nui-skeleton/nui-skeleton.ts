import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiSkeletonViewState, renderSkeleton } from './logic.js';
import type { SkeletonAnimation, SkeletonShape } from './types.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-skeleton')
export class NuiSkeleton extends LitElement implements NuiSkeletonViewState {
  @property({ type: String }) shape: SkeletonShape | '' = '';
  @property({ type: String }) size = '';
  @property({ type: String }) width = '';
  @property({ type: String }) height = '';
  @property({ type: String, attribute: 'border-radius' })
  borderRadius = '';
  @property({ type: String }) animation: SkeletonAnimation | '' = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'skeleton-class' })
  skeletonClass = '';

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  render() {
    return renderSkeleton(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-skeleton': NuiSkeleton;
  }
}
