import '../components/nui-heading/nui-heading.js';
import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { applyTheme, type Palette, type ThemeMode } from '../theme.js';
import {
  createInitialPropsState,
  getPlaygroundDefinition,
  playgroundRegistry,
} from './registry.js';
import styles from './styles.css' with { type: 'css' };
import type { PlaygroundProps } from './types.js';
import { renderHeader } from './views/header.js';
import { renderNav } from './views/nav.js';
import { renderWorkspace } from './views/workspace.js';

@customElement('playground-app')
export class PlaygroundApp extends LitElement {
  @state() private selectedTag = playgroundRegistry[0]?.tag ?? '';
  @state() private palette: Palette = 'nuxt';
  @state() private mode: ThemeMode = 'dark';
  @state() private propsByTag: Record<string, PlaygroundProps> =
    createInitialPropsState();

  static styles = styles;

  connectedCallback() {
    super.connectedCallback();
    applyTheme(this.palette, this.mode);
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('palette') || changed.has('mode')) {
      applyTheme(this.palette, this.mode);
    }
  }

  private get definition() {
    return getPlaygroundDefinition(this.selectedTag);
  }

  private get currentProps(): PlaygroundProps {
    const definition = this.definition;
    if (!definition) {
      return {};
    }

    return this.propsByTag[this.selectedTag] ?? { ...definition.defaults };
  }

  private selectComponent(tag: string) {
    this.selectedTag = tag;
  }

  private updateProp(key: string, value: string | boolean) {
    const definition = this.definition;
    let nextProps: PlaygroundProps = {
      ...this.currentProps,
      [key]: value,
    };

    if (definition?.onPropChange) {
      const patch = definition.onPropChange(key, value, nextProps);

      if (patch) {
        nextProps = { ...nextProps, ...patch };
      }
    }

    this.propsByTag = {
      ...this.propsByTag,
      [this.selectedTag]: nextProps,
    };
  }

  private resetProps() {
    const definition = this.definition;
    if (!definition) {
      return;
    }

    this.propsByTag = {
      ...this.propsByTag,
      [this.selectedTag]: { ...definition.defaults },
    };
  }

  render() {
    const definition = this.definition;

    return html`
      ${renderHeader(
        this.palette,
        this.mode,
        (palette) => {
          this.palette = palette;
        },
        (mode) => {
          this.mode = mode;
        },
      )}
      <div class="layout">
        ${renderNav(playgroundRegistry, this.selectedTag, (tag) =>
          this.selectComponent(tag),
        )}
        <main>
          ${
            definition
              ? renderWorkspace(
                  definition,
                  this.currentProps,
                  (key, value) => this.updateProp(key, value),
                  () => this.resetProps(),
                )
              : html`<p class="empty">No component selected.</p>`
          }
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
