import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiHeadingViewState, renderHeading } from './logic.js';

const styles = createComponentStyles(
  'nui-heading',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-heading')
export class NuiHeading extends LitElement implements NuiHeadingViewState {
  @property({ type: Number }) tag = 2;
  @property({ type: String }) text = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'heading-class' }) headingClass = '';

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
    return renderHeading(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-heading': NuiHeading;
  }
}
