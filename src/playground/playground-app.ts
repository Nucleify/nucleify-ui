import '../components/nui-heading/nui-heading.js';
import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
  abyss,
  apex,
  applyPreset,
  cosmos,
  eclipse,
  kinetic,
  nucleus,
  type Preset,
  type PresetName,
  prism,
  quantum,
  registerRainbowLoader,
  type ThemeMode,
} from '../themes/index.js';
import {
  createInitialPropsState,
  getPlaygroundDefinition,
  playgroundRegistry,
} from './registry.js';
import styles from './styles.css' with { type: 'css' };
import type { PlaygroundProps } from './types.js';
import { GUIDE_PAGES, renderGuidePage } from './views/guide-page.js';
import { renderHeader } from './views/header.js';
import { type NavTabId, renderNav } from './views/nav.js';
import { renderWorkspace } from './views/workspace.js';

// Literal import so the dev server can resolve the optional nui-rainbow package.
registerRainbowLoader(() => import('nui-rainbow'));

const PRESET_MAP: Record<PresetName, Preset> = {
  nucleus,
  quantum,
  kinetic,
  cosmos,
  apex,
  eclipse,
  prism,
  abyss,
};

// Eagerly compile and inject initial theme so CSS variables are immediately available before render
if (typeof document !== 'undefined') {
  applyPreset(PRESET_MAP.nucleus, { mode: 'dark' });
}

@customElement('playground-app')
export class PlaygroundApp extends LitElement {
  @state() private selectedTag = playgroundRegistry[0]?.tag ?? '';
  @state() private activeNavTab: NavTabId = 'components';
  @state() private preset: PresetName = 'nucleus';
  @state() private mode: ThemeMode = 'dark';
  @state() private navOpen = false;
  @state() private propsByTag: Record<string, PlaygroundProps> =
    createInitialPropsState();

  static styles = styles;

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.navOpen = false;
    }
  };

  disconnectedCallback() {
    window.removeEventListener('keydown', this.handleKeydown);
    super.disconnectedCallback();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this.handleKeydown);
    applyPreset(PRESET_MAP[this.preset], { mode: this.mode });
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('preset') || changed.has('mode')) {
      applyPreset(PRESET_MAP[this.preset], { mode: this.mode });
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
    this.navOpen = false;
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
        const cleanedPatch = Object.fromEntries(
          Object.entries(patch).filter(
            ([, patchValue]) => patchValue !== undefined,
          ),
        ) as Partial<PlaygroundProps>;
        nextProps = { ...nextProps, ...cleanedPatch } as PlaygroundProps;
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
        this.preset,
        this.mode,
        (preset) => {
          this.preset = preset;
        },
        (mode) => {
          this.mode = mode;
        },
        () => {
          this.navOpen = !this.navOpen;
        },
      )}
      <div class="layout">
        ${renderNav(
          playgroundRegistry,
          this.selectedTag,
          (tag) => this.selectComponent(tag),
          this.navOpen,
          () => {
            this.navOpen = false;
          },
          this.activeNavTab,
          (tab) => {
            this.activeNavTab = tab;
            if (tab === 'guides' && !GUIDE_PAGES[this.selectedTag]) {
              this.selectedTag = 'installation';
            } else if (tab === 'resources' && !GUIDE_PAGES[this.selectedTag]) {
              this.selectedTag = 'github';
            } else if (tab === 'components' && !this.definition) {
              this.selectedTag = playgroundRegistry[0]?.tag ?? '';
            }
          },
        )}
        <main>
          ${
            this.activeNavTab !== 'components' && GUIDE_PAGES[this.selectedTag]
              ? renderGuidePage(GUIDE_PAGES[this.selectedTag])
              : definition
                ? renderWorkspace(
                    definition,
                    this.currentProps,
                    (key, value) => this.updateProp(key, value),
                    () => this.resetProps(),
                  )
                : html`<p class="empty">No component or page selected.</p>`
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
