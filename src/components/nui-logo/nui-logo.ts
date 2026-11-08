import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiLogoViewState, renderLogo } from './logic.js';

const styles = createComponentStyles(
  'nui-logo',
  () => import('./styles.css', { with: { type: 'css' } }),
);

const reflectNonEmptyString = {
  fromAttribute: (val: string | null) => val ?? '',
  toAttribute: (val: string) => (val?.trim() ? val : null),
};

@customElement('nui-logo')
export class NuiLogo extends LitElement implements NuiLogoViewState {
  @property({ type: Number }) dimensions = 44;
  @property({ type: String }) svg = '';
  @property({
    type: String,
    reflect: true,
    converter: reflectNonEmptyString,
  })
  mode: 'dark' | 'light' | '' = '';
  @property({ type: Boolean, attribute: 'use-symbol' }) useSymbol = false;
  @property({
    type: String,
    attribute: 'lighter-color-class',
    reflect: true,
    converter: reflectNonEmptyString,
  })
  lighterColorClass = '';
  @property({
    type: String,
    attribute: 'darker-color-class',
    reflect: true,
    converter: reflectNonEmptyString,
  })
  darkerColorClass = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({
    type: String,
    attribute: 'logo-class',
    reflect: true,
    converter: reflectNonEmptyString,
  })
  logoClass = '';

  @state() private detectedMode: 'dark' | 'light' = 'dark';
  private themeObserver: MutationObserver | null = null;

  protected createRenderRoot() {
    const root = super.createRenderRoot();
    void styles.sync(root, { unstyled: this.unstyled });
    return root;
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateDetectedMode();
    this.startThemeObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopThemeObserver();
  }

  private updateDetectedMode(): void {
    if (typeof document === 'undefined') {
      return;
    }

    const hostOrAncestor =
      this.closest?.('.nui-light, [data-theme="light"]') ||
      document.documentElement.closest?.('.nui-light, [data-theme="light"]') ||
      document.body?.closest?.('.nui-light, [data-theme="light"]');

    const isLight =
      Boolean(hostOrAncestor) ||
      document.body?.classList.contains('nui-light') ||
      document.documentElement.classList.contains('nui-light');

    const nextMode = isLight ? 'light' : 'dark';
    if (this.detectedMode !== nextMode) {
      this.detectedMode = nextMode;
    }
  }

  private startThemeObserver(): void {
    if (
      typeof MutationObserver === 'undefined' ||
      typeof document === 'undefined'
    ) {
      return;
    }

    this.themeObserver = new MutationObserver(() => {
      this.updateDetectedMode();
    });

    const targets = [
      document.documentElement,
      document.body,
      this.parentElement,
    ].filter(Boolean) as HTMLElement[];

    for (const target of targets) {
      this.themeObserver.observe(target, {
        attributes: true,
        attributeFilter: ['class', 'data-theme'],
      });
    }
  }

  private stopThemeObserver(): void {
    if (this.themeObserver) {
      this.themeObserver.disconnect();
      this.themeObserver = null;
    }
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  render() {
    const activeMode = this.mode || this.detectedMode;
    return renderLogo({
      dimensions: this.dimensions,
      svg: this.svg,
      mode: this.mode,
      activeMode,
      useSymbol: this.useSymbol,
      lighterColorClass: this.lighterColorClass,
      darkerColorClass: this.darkerColorClass,
      nuiType: this.nuiType,
      logoClass: this.logoClass,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-logo': NuiLogo;
  }
}
