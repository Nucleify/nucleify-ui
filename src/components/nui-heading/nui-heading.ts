import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import { syncStylesWhen } from '../../utils/sync-stylesheet.js';
import { type NuiHeadingViewState, renderHeading } from './logic.js';

let baseStylesheet: CSSStyleSheet | null = null;
let themeStylesheet: CSSStyleSheet | null = null;

async function syncHeadingStyles(
  renderRoot: Element | DocumentFragment,
  unstyled: boolean,
): Promise<void> {
  if (!(renderRoot instanceof ShadowRoot)) {
    return;
  }

  if (!baseStylesheet) {
    const baseModule = await import('./base.css', { with: { type: 'css' } });
    baseStylesheet = baseModule.default;
  }

  if (unstyled) {
    renderRoot.adoptedStyleSheets = [baseStylesheet];
    return;
  }

  if (!themeStylesheet) {
    const themeModule = await import('./styles.css', { with: { type: 'css' } });
    themeStylesheet = themeModule.default;
  }

  renderRoot.adoptedStyleSheets = [baseStylesheet, themeStylesheet];
}

@customElement('nui-heading')
export class NuiHeading extends LitElement implements NuiHeadingViewState {
  @property({ type: Number }) tag = 2;
  @property({ type: String }) text = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'heading-class' }) headingClass = '';

  protected firstUpdated() {
    void syncHeadingStyles(this.renderRoot, this.unstyled);
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      syncHeadingStyles(this.renderRoot, this.unstyled),
    );
  }

  render() {
    return renderHeading(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-heading': NuiHeading;
  }
}
