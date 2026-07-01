import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiButtonViewState, renderButton } from './logic.js';
import type {
  BadgeSeverity,
  ButtonIconPosition,
  ButtonMedia,
  ButtonSeverity,
  ButtonSize,
  ButtonType,
  ButtonVariant,
} from './types.js';

const styles = createComponentStyles(
  'nui-button',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-button')
export class NuiButton extends LitElement implements NuiButtonViewState {
  @property({ type: String }) label = 'Button';
  @property({ type: String }) variant: ButtonVariant = 'primary';
  @property({ type: String }) severity: ButtonSeverity | '' = '';
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) type: ButtonType = 'button';
  @property({ type: String }) icon = '';
  @property({ type: String }) iconPos: ButtonIconPosition = 'left';
  @property({ type: String, attribute: 'icon-class' }) iconClass = '';
  @property({ type: String }) badge = '';
  @property({ type: String, attribute: 'badge-class' }) badgeClass = '';
  @property({ type: String, attribute: 'badge-severity' })
  badgeSeverity: BadgeSeverity = 'secondary';
  @property({ type: Boolean }) loading = false;
  @property({ type: String, attribute: 'loading-icon' }) loadingIcon = '';
  @property({ type: Boolean }) link = false;
  @property({ type: Boolean }) raised = false;
  @property({ type: Boolean }) rounded = false;
  @property({ type: Boolean }) text = false;
  @property({ type: Boolean }) outlined = false;
  @property({ type: String }) size: ButtonSize | '' = '';
  @property({ type: Boolean }) plain = false;
  @property({ type: Boolean }) fluid = false;
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String }) media: ButtonMedia | '' = '';
  @property({ type: String }) alt = '';
  @property({ type: String }) width = '';
  @property({ type: String }) height = '';
  @property({ type: String }) gap = '';
  @property({ type: String }) padding = '';
  @property({ type: String }) src = '';
  @property({ type: String, attribute: 'button-class' }) buttonClass = '';
  @property({ type: String, attribute: 'button-style' }) buttonStyle = '';

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  render() {
    return renderButton(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-button': NuiButton;
  }
}
