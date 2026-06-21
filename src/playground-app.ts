import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { componentRegistry, type ComponentEntry } from './registry.js';
import { applyTheme, type Palette, type ThemeMode } from './theme.js';

@customElement('playground-app')
export class PlaygroundApp extends LitElement {
  @state() private selectedTag = componentRegistry[0]?.tag ?? '';
  @state() private palette: Palette = 'nuxt';
  @state() private mode: ThemeMode = 'dark';

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--nuc-bg-dark-color);
      color: var(--nuc-white-text-color);
    }

    header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--nuc-card-border);
      background: var(--nuc-content-background);
    }

    .header-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    header h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--nuc-white-text-color);
    }

    header p {
      margin: 0.375rem 0 0;
      color: var(--nuc-secondary-text-color);
      font-size: 0.875rem;
    }

    .theme-controls {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .control-group {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem;
      border-radius: 0.5rem;
      background: var(--nuc-bg-green-color-05);
      border: 1px solid var(--nuc-card-border);
    }

    .control-group span {
      padding: 0 0.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--nuc-secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .control-group button {
      padding: 0.375rem 0.75rem;
      border: 1px solid transparent;
      border-radius: 0.375rem;
      background: transparent;
      color: var(--nuc-primary-text-color);
      font: inherit;
      font-size: 0.8125rem;
      cursor: pointer;
      transition:
        background 0.15s,
        color 0.15s,
        border-color 0.15s;
    }

    .control-group button:hover {
      background: var(--nuc-primary-highlight-color);
    }

    .control-group button[aria-pressed='true'] {
      background: var(--nuc-primary-color);
      border-color: var(--nuc-primary-color);
      color: var(--nuc-primary-white-text-color);
    }

    .layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      min-height: calc(100vh - 6.5rem);
    }

    aside {
      padding: 1rem;
      border-right: 1px solid var(--nuc-card-border);
      background: var(--nuc-bg-dark-green-color);
    }

    aside h2 {
      margin: 0 0 0.75rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--nuc-secondary-text-color);
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    nav button {
      text-align: left;
      padding: 0.625rem 0.75rem;
      border: 1px solid transparent;
      border-radius: 0.5rem;
      background: transparent;
      color: var(--nuc-primary-text-color);
      cursor: pointer;
      font: inherit;
    }

    nav button:hover {
      background: var(--nuc-primary-highlight-color);
    }

    nav button[aria-current='true'] {
      background: var(--nuc-primary-selected-color);
      border-color: var(--nuc-primary-secondary-color);
      color: var(--nuc-white-text-color);
    }

    main {
      padding: 2rem;
    }

    .preview-panel {
      max-width: 48rem;
    }

    .preview-panel h2 {
      margin: 0 0 0.25rem;
      font-size: 1.125rem;
      color: var(--nuc-white-text-color);
    }

    .description {
      margin: 0 0 1.5rem;
      color: var(--nuc-secondary-text-color);
      font-size: 0.875rem;
    }

    .preview-box {
      padding: 2rem;
      border-radius: 0.75rem;
      background: var(--nuc-card-background);
      border: 1px dashed var(--nuc-card-border);
      box-shadow: 0 1px 3px var(--nuc-card-box-shadow);
      min-height: 8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .usage {
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: 0.5rem;
      background: var(--nuc-bg-black-color);
      border: 1px solid var(--nuc-card-border);
      font-family: ui-monospace, monospace;
      font-size: 0.8125rem;
      color: var(--nuc-primary-white-green-text-color);
      overflow-x: auto;
    }

    .empty {
      padding: 2rem;
      color: var(--nuc-secondary-text-color);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.syncTheme();
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('palette') || changed.has('mode')) {
      this.syncTheme();
    }
  }

  private syncTheme() {
    applyTheme(this.palette, this.mode);
  }

  private get selected(): ComponentEntry | undefined {
    return componentRegistry.find((entry) => entry.tag === this.selectedTag);
  }

  private selectComponent(tag: string) {
    this.selectedTag = tag;
  }

  private setPalette(palette: Palette) {
    this.palette = palette;
  }

  private setMode(mode: ThemeMode) {
    this.mode = mode;
  }

  private renderUsage(entry: ComponentEntry) {
    const attrs = entry.attributes
      ? Object.entries(entry.attributes)
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ')
      : '';
    const tagLine = attrs
      ? `<${entry.tag} ${attrs}></${entry.tag}>`
      : `<${entry.tag}></${entry.tag}>`;

    return html`<div class="usage">${tagLine}</div>`;
  }

  private renderPreview(entry: ComponentEntry) {
    const el = document.createElement(entry.tag);
    if (entry.attributes) {
      for (const [key, value] of Object.entries(entry.attributes)) {
        el.setAttribute(key, value);
      }
    }
    return el;
  }

  private renderThemeControls() {
    return html`
      <div class="theme-controls">
        <div class="control-group">
          <span>Palette</span>
          <button
            aria-pressed=${this.palette === 'nuxt' ? 'true' : 'false'}
            @click=${() => this.setPalette('nuxt')}
          >
            Nuxt
          </button>
          <button
            aria-pressed=${this.palette === 'next' ? 'true' : 'false'}
            @click=${() => this.setPalette('next')}
          >
            Next
          </button>
        </div>
        <div class="control-group">
          <span>Theme</span>
          <button
            aria-pressed=${this.mode === 'light' ? 'true' : 'false'}
            @click=${() => this.setMode('light')}
          >
            Light
          </button>
          <button
            aria-pressed=${this.mode === 'dark' ? 'true' : 'false'}
            @click=${() => this.setMode('dark')}
          >
            Dark
          </button>
        </div>
      </div>
    `;
  }

  render() {
    const selected = this.selected;

    return html`
      <header>
        <div class="header-top">
          <div>
            <h1>Nucleify UI Playground</h1>
            <p>Test Lit components – add new entries in src/registry.ts</p>
          </div>
          ${this.renderThemeControls()}
        </div>
      </header>

      <div class="layout">
        <aside>
          <h2>Components</h2>
          <nav>
            ${componentRegistry.map(
              (entry) => html`
                <button
                  aria-current=${entry.tag === this.selectedTag ? 'true' : 'false'}
                  @click=${() => this.selectComponent(entry.tag)}
                >
                  ${entry.label}
                </button>
              `,
            )}
          </nav>
        </aside>

        <main>
          ${selected
            ? html`
                <div class="preview-panel">
                  <h2>${selected.label}</h2>
                  ${selected.description
                    ? html`<p class="description">${selected.description}</p>`
                    : nothing}
                  <div class="preview-box">
                    ${this.renderPreview(selected)}
                    ${selected.tag === 'nui-button'
                      ? html`<nui-button label="Secondary" variant="secondary"></nui-button>`
                      : nothing}
                  </div>
                  ${this.renderUsage(selected)}
                </div>
              `
            : html`<p class="empty">No components in the registry.</p>`}
        </main>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'playground-app': PlaygroundApp;
  }
}
