import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import { syncStylesWhen } from '../../utils/sync-stylesheet.js';
import { type NuiParagraphViewState, renderParagraph } from './logic.js';

let baseStylesheet: CSSStyleSheet | null = null;
let themeStylesheet: CSSStyleSheet | null = null;

async function syncParagraphStyles(
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

@customElement('nui-paragraph')
export class NuiParagraph extends LitElement implements NuiParagraphViewState {
  @property({ type: String }) text = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'paragraph-class' })
  paragraphClass = '';

  protected firstUpdated() {
    void syncParagraphStyles(this.renderRoot, this.unstyled);
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      syncParagraphStyles(this.renderRoot, this.unstyled),
    );
  }

  render() {
    return renderParagraph(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-paragraph': NuiParagraph;
  }
}
