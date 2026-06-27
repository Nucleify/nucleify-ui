import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiLogoViewState, renderLogo } from './logic.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-logo')
export class NuiLogo extends LitElement implements NuiLogoViewState {
  @property({ type: Number }) dimensions = 44;
  @property({ type: Boolean, attribute: 'use-symbol' }) useSymbol = false;
  @property({ type: String, attribute: 'lighter-color-class' })
  lighterColorClass = '';
  @property({ type: String, attribute: 'darker-color-class' })
  darkerColorClass = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'logo-class' }) logoClass = '';

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  render() {
    return renderLogo(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-logo': NuiLogo;
  }
}
