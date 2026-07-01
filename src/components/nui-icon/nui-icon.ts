import 'iconify-icon';
import { html, LitElement, nothing, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import { createComponentStyles } from '../../utils/sync-stylesheet.js';

const styles = createComponentStyles(
  'nui-icon',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-icon')
export class NuiIcon extends LitElement {
  @property({ type: String }) icon = '';
  @property({ type: String }) width = '';
  @property({ type: String }) height = '';
  @property({ type: String, reflect: true }) mode: 'svg' | 'mask' | 'style' =
    'svg';
  @nuiTypeProperty nuiType: NuiType = '';

  protected firstUpdated() {
    void styles.sync(this.renderRoot);
    this.syncHostSize();
  }

  protected updated(changed: PropertyValues) {
    if (changed.has('width') || changed.has('height')) {
      this.syncHostSize();
    }
  }

  private syncHostSize() {
    if (this.width) {
      this.style.width = this.width;
    } else {
      this.style.removeProperty('width');
    }

    if (this.height) {
      this.style.height = this.height;
    } else {
      this.style.removeProperty('height');
    }
  }

  render() {
    if (!this.icon) {
      return nothing;
    }

    return html`
      <iconify-icon
        icon=${this.icon}
        width="100%"
        height="100%"
        mode=${this.mode}
      ></iconify-icon>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-icon': NuiIcon;
  }
}
