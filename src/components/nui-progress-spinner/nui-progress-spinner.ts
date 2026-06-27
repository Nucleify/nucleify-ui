import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  getHostStyle,
  type NuiProgressSpinnerViewState,
  renderProgressSpinner,
} from './logic.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-progress-spinner')
export class NuiProgressSpinner
  extends LitElement
  implements NuiProgressSpinnerViewState
{
  @property({ type: String, attribute: 'stroke-width', reflect: true })
  strokeWidth = '2';
  @property({ type: String, reflect: true }) fill = 'none';
  @property({ type: String, attribute: 'animation-duration', reflect: true })
  animationDuration = '2s';
  @property({ type: String }) width = '';
  @property({ type: String }) height = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'progress-spinner-class' })
  progressSpinnerClass = '';

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    this.syncHostSize();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('width') || changed.has('height')) {
      this.syncHostSize();
    }
  }

  private syncHostSize(): void {
    const hostStyle = getHostStyle(this.width, this.height);

    if (hostStyle) {
      this.setAttribute('style', hostStyle);
      return;
    }

    this.removeAttribute('style');
  }

  render() {
    return renderProgressSpinner(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-progress-spinner': NuiProgressSpinner;
  }
}
