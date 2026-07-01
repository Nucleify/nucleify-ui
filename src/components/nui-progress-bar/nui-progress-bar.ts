import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  getHostStyle,
  type NuiProgressBarViewState,
  renderProgressBar,
} from './logic.js';
import type { ProgressBarMode } from './types.js';

const styles = createComponentStyles(
  'nui-progress-bar',
  () => import('./styles.css', { with: { type: 'css' } }),
);

const showValueConverter = {
  fromAttribute(value: string | null): boolean {
    if (value === null || value === '') {
      return true;
    }

    if (value === 'false' || value === '0') {
      return false;
    }

    return true;
  },
  toAttribute(value: boolean): string | null {
    return value ? null : 'false';
  },
};

@customElement('nui-progress-bar')
export class NuiProgressBar
  extends LitElement
  implements NuiProgressBarViewState
{
  @property({ type: Number, reflect: true }) value = 0;
  @property({ type: String, reflect: true }) mode: ProgressBarMode =
    'determinate';
  @property({
    type: Boolean,
    attribute: 'show-value',
    converter: showValueConverter,
  })
  showValue = true;
  @property({ type: String }) width = '';
  @property({ type: String }) height = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'progress-bar-class' })
  progressBarClass = '';

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
    return renderProgressBar(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-progress-bar': NuiProgressBar;
  }
}
