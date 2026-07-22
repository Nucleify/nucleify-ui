import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiTagViewState, renderTag } from './logic.js';
import type { TagSeverity } from './types.js';

const styles = createComponentStyles(
  'nui-tag',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-tag')
export class NuiTag extends LitElement implements NuiTagViewState {
  @property({ type: String }) value = '';
  @property({ type: String }) severity: TagSeverity | '' = '';
  @property({ type: Boolean }) rounded = false;
  @property({ type: String }) icon = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'tag-class' }) tagClass = '';

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
    return renderTag(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-tag': NuiTag;
  }
}
