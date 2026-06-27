import '../nui-icon/nui-icon.js';
import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  clampRatingValue,
  clampStars,
  getNextRatingValue,
  getRatingGroupName,
  type NuiRatingViewState,
  renderRating,
} from './logic.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-rating')
export class NuiRating extends LitElement implements NuiRatingViewState {
  @property({ type: Number, reflect: true }) value = 0;
  @property({ type: String }) name = '';
  @property({ type: Number, reflect: true }) stars = 5;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: String, attribute: 'on-icon' }) onIcon = '';
  @property({ type: String, attribute: 'off-icon' }) offIcon = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'rating-class' }) ratingClass = '';

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    this.normalizeValue();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('value') || changed.has('stars')) {
      this.normalizeValue();
    }
  }

  private normalizeValue(): void {
    const stars = clampStars(this.stars);
    const value = clampRatingValue(this.value, stars);

    if (this.stars !== stars) {
      this.stars = stars;
    }

    if (this.value !== value) {
      this.value = value;
    }
  }

  private updateValue(event: Event, star: number): void {
    if (this.disabled || this.readonly) {
      return;
    }

    const nextValue = getNextRatingValue(this.value, star);

    if (this.value === nextValue) {
      return;
    }

    this.value = nextValue;

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value, originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleOptionClick = (event: Event, star: number): void => {
    event.preventDefault();
    this.updateValue(event, star);
  };

  private handleOptionChange = (event: Event, star: number): void => {
    this.updateValue(event, star);
  };

  render() {
    return renderRating(
      this,
      getRatingGroupName(this.name, this.id),
      this.handleOptionClick,
      this.handleOptionChange,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-rating': NuiRating;
  }
}
