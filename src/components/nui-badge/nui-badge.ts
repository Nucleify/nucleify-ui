import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiBadgeViewState, renderBadge } from './logic.js';
import type { BadgeSeverity, BadgeSize } from './types.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-badge')
export class NuiBadge extends LitElement implements NuiBadgeViewState {
  @property({ type: String }) value = '';
  @property({ type: String }) severity: BadgeSeverity | '' = '';
  @property({ type: String }) size: BadgeSize | '' = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'badge-class' }) badgeClass = '';

  get lightDomHasContent(): boolean {
    return Array.from(this.childNodes).some((node) =>
      node.nodeType === Node.TEXT_NODE
        ? Boolean(node.textContent?.trim())
        : true,
    );
  }

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  render() {
    return renderBadge(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-badge': NuiBadge;
  }
}
