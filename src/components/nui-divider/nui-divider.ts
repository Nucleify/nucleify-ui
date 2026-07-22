import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiDividerViewState, renderDivider } from './logic.js';
import type { DividerAlign, DividerLayout, DividerType } from './types.js';

const styles = createComponentStyles(
  'nui-divider',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-divider')
export class NuiDivider extends LitElement implements NuiDividerViewState {
  @property({ type: String, reflect: true }) layout: DividerLayout | '' = '';
  @property({ type: String }) align: DividerAlign | '' = '';
  @property({ type: String }) type: DividerType | '' = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'divider-class' }) dividerClass = '';

  get lightDomHasContent(): boolean {
    return Array.from(this.childNodes).some((node) =>
      node.nodeType === Node.TEXT_NODE
        ? Boolean(node.textContent?.trim())
        : true,
    );
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
    return renderDivider(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-divider': NuiDivider;
  }
}
