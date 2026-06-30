import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiTooltipViewState, renderTooltip } from './logic.js';
import {
  computeTooltipPosition,
  type TooltipCoords,
} from './tooltip-position.js';
import type { TooltipPosition } from './types.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-tooltip')
export class NuiTooltip extends LitElement implements NuiTooltipViewState {
  @property({ type: String }) value = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, attribute: 'tooltip-id' }) tooltipId = '';
  @property({ type: String, attribute: 'tooltip-class' }) tooltipClass = '';
  @property({ type: Boolean, attribute: 'escape' }) escape = true;
  @property({ type: Boolean, attribute: 'fit-content' }) fitContent = true;
  @property({ type: Number, attribute: 'show-delay' }) showDelay = 0;
  @property({ type: Number, attribute: 'hide-delay' }) hideDelay = 0;
  @property({ type: Boolean, attribute: 'auto-hide' }) autoHide = true;
  @property({ type: String, reflect: true }) position: TooltipPosition =
    'right';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';

  @state() visible = false;
  @state() coords: TooltipCoords | null = null;

  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private boundReposition = () => this.updatePosition();

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    this.bindTriggerEvents();
    window.addEventListener('scroll', this.boundReposition, true);
    window.addEventListener('resize', this.boundReposition);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.clearTimers();
    window.removeEventListener('scroll', this.boundReposition, true);
    window.removeEventListener('resize', this.boundReposition);
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('disabled') && this.disabled) {
      this.hide(true);
    }

    if (
      this.visible &&
      (changed.has('position') || changed.has('fitContent'))
    ) {
      this.updatePosition();
    }
  }

  private bindTriggerEvents(): void {
    const trigger = this.renderRoot.querySelector('.nui-tooltip-trigger');

    if (!trigger) {
      return;
    }

    trigger.addEventListener('mouseenter', this.handleShow);
    trigger.addEventListener('mouseleave', this.handleHide);
    trigger.addEventListener('focusin', this.handleShow);
    trigger.addEventListener('focusout', this.handleHide);
  }

  private clearTimers(): void {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  private handleShow = (): void => {
    if (this.disabled || !this.value.trim()) {
      return;
    }

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    if (this.visible) {
      return;
    }

    if (this.showDelay > 0) {
      this.showTimer = setTimeout(() => {
        this.showTimer = null;
        this.show();
      }, this.showDelay);
      return;
    }

    this.show();
  };

  private handleHide = (): void => {
    if (!this.autoHide) {
      return;
    }

    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }

    if (!this.visible) {
      return;
    }

    if (this.hideDelay > 0) {
      this.hideTimer = setTimeout(() => {
        this.hideTimer = null;
        this.hide();
      }, this.hideDelay);
      return;
    }

    this.hide();
  };

  private show(): void {
    this.visible = true;
    this.updatePosition();
    requestAnimationFrame(() => this.updatePosition());
  }

  private hide(immediate = false): void {
    if (immediate) {
      this.clearTimers();
      this.coords = null;
    }

    this.visible = false;
  }

  private getTriggerRect(): DOMRect | null {
    const trigger = this.renderRoot.querySelector('.nui-tooltip-trigger');

    if (!trigger) {
      return null;
    }

    const assigned = this.querySelector('*');

    if (assigned) {
      return assigned.getBoundingClientRect();
    }

    return trigger.getBoundingClientRect();
  }

  private updatePosition(): void {
    if (!this.visible) {
      return;
    }

    const triggerRect = this.getTriggerRect();
    const tooltip = this.renderRoot.querySelector('.nui-tooltip');

    if (!triggerRect || !(tooltip instanceof HTMLElement)) {
      return;
    }

    const tooltipRect = tooltip.getBoundingClientRect();

    this.coords = computeTooltipPosition(
      triggerRect,
      tooltipRect,
      this.position,
      this.fitContent,
    );
  }

  render() {
    return renderTooltip(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-tooltip': NuiTooltip;
  }
}
