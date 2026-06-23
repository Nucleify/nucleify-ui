import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiAvatarViewState, renderAvatar } from './logic.js';
import type { AvatarShape, AvatarSize } from './types.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-avatar')
export class NuiAvatar extends LitElement implements NuiAvatarViewState {
  @property({ type: String }) label = '';
  @property({ type: String }) icon = '';
  @property({ type: String }) image = '';
  @property({ type: String }) size: AvatarSize | '' = '';
  @property({ type: String }) shape: AvatarShape | '' = '';
  @property({ type: String, attribute: 'aria-label' }) ariaLabel = '';
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledby = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'avatar-class' }) avatarClass = '';

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  private handleError = (event: Event): void => {
    this.dispatchEvent(
      new CustomEvent('error', {
        detail: { originalEvent: event },
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    return renderAvatar(this, this.handleError);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-avatar': NuiAvatar;
  }
}
