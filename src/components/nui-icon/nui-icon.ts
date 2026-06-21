import 'iconify-icon';
import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import { createComponentStyles } from '../../utils/sync-stylesheet.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-icon')
export class NuiIcon extends LitElement {
  @property({ type: String }) icon = '';
  @property({ type: String }) width = '1em';
  @property({ type: String }) height = '1em';
  @property({ type: String, reflect: true }) mode: 'svg' | 'mask' | 'style' =
    'svg';
  @nuiTypeProperty nuiType: NuiType = '';

  protected firstUpdated() {
    void styles.sync(this.renderRoot);
  }

  render() {
    if (!this.icon) {
      return nothing;
    }

    return html`
      <iconify-icon
        icon=${this.icon}
        width=${this.width}
        height=${this.height}
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
