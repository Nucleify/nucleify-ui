import '../components/nui-heading/nui-heading.js';
import '../components/nui-toast/nui-toast.js';
import { html, LitElement, nothing } from 'lit';
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
import type { ComponentCategoryId } from './categories.js';
import {
  createInitialPropsState,
  getPlaygroundDefinition,
  playgroundRegistry,
} from './registry.js';
import styles from './styles.css' with { type: 'css' };
import type { PlaygroundProps } from './types.js';
import { renderComponentsBrowser } from './views/components-browser.js';
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

const GUIDE_ROUTE_IDS = new Set([
  'installation',
  'configuration',
  'styled-mode',
  'unstyled-mode',
  'isolated-mode',
]);

const RESOURCE_ROUTE_IDS = new Set([
  'github',
  'discord',
  'contributing',
  'code-of-conduct',
  'license',
  'security',
]);

function componentSlugFromTag(tag: string): string {
  return tag.startsWith('nui-') ? tag.slice(4) : tag;
}

function tagFromComponentSlug(slug: string): string | undefined {
  const normalized = slug.startsWith('nui-') ? slug : `nui-${slug}`;
  return getPlaygroundDefinition(normalized) ? normalized : undefined;
}

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname || '/';
}

function titleForRoute(tab: NavTabId, selectedTag: string): string {
  if (tab === 'components') {
    if (!selectedTag || selectedTag === 'components') {
      return 'Components — nucleify-ui';
    }
    const definition = getPlaygroundDefinition(selectedTag);
    return definition
      ? `${definition.label} — nucleify-ui`
      : 'Components — nucleify-ui';
  }

  const guide = GUIDE_PAGES[selectedTag];
  if (guide) {
    return `${guide.title} — nucleify-ui`;
  }

  return 'nucleify-ui Docs';
}

@customElement('docs-app')
export class DocsApp extends LitElement {
  @state() private selectedTag = '';
  @state() private activeNavTab: NavTabId = 'components';
  @state() private activeCategory: ComponentCategoryId = 'all';
  @state() private componentSearch = '';
  @state() private isResetCoolingDown = false;
  private resetCooldownTimer: number | null = null;
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

    const isKbdSearch =
      (event.key === '/' && !this.isEditingInput(event)) ||
      ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k');

    if (isKbdSearch) {
      event.preventDefault();
      if (this.activeNavTab !== 'components') {
        this.activeNavTab = 'components';
        this.selectedTag = '';
      } else if (this.selectedTag && this.selectedTag !== 'components') {
        this.selectedTag = '';
      }
      this.syncUrl();
      requestAnimationFrame(() => {
        const input = this.renderRoot.querySelector<HTMLInputElement>(
          '.browser-search-input',
        );
        input?.focus();
        input?.select();
      });
    }
  };

  private isEditingInput(event: KeyboardEvent): boolean {
    const target = event.composedPath()[0] as HTMLElement | null;
    if (!target) return false;
    const tag = target.tagName?.toLowerCase();
    return (
      tag === 'input' ||
      tag === 'textarea' ||
      tag === 'select' ||
      target.isContentEditable
    );
  }

  private handlePointerDown = (event: PointerEvent) => {
    if (!this.navOpen) return;
    const path = event.composedPath();
    const isInsideAside = path.some(
      (el) => el instanceof HTMLElement && el.tagName.toLowerCase() === 'aside',
    );
    const isMenuButton = path.some(
      (el) => el instanceof HTMLElement && el.classList.contains('menu-button'),
    );
    if (!isInsideAside && !isMenuButton) {
      this.navOpen = false;
    }
  };

  private handlePopState = () => {
    this.applyUrlState();
  };

  disconnectedCallback() {
    if (this.resetCooldownTimer !== null) {
      window.clearTimeout(this.resetCooldownTimer);
      this.resetCooldownTimer = null;
    }
    window.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('popstate', this.handlePopState);
    window.removeEventListener('pointerdown', this.handlePointerDown);
    super.disconnectedCallback();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this.handleKeydown);
    window.addEventListener('popstate', this.handlePopState);
    window.addEventListener('pointerdown', this.handlePointerDown);
    this.applyUrlState();
    this.syncUrl({ replace: true });
    applyPreset(PRESET_MAP[this.preset], { mode: this.mode });
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('preset') || changed.has('mode')) {
      applyPreset(PRESET_MAP[this.preset], { mode: this.mode });
    }

    if (
      changed.has('selectedTag') ||
      changed.has('activeNavTab') ||
      changed.has('activeCategory')
    ) {
      this.scrollSelectedNavItemIntoView();
    }
  }

  /** Keep the active sidebar entry visible (deep links + in-app selection). */
  private scrollSelectedNavItemIntoView() {
    if (!this.selectedTag) {
      return;
    }

    void this.updateComplete.then(() => {
      requestAnimationFrame(() => {
        const selected = this.renderRoot.querySelector<HTMLElement>(
          '.nav-item.is-selected',
        );
        selected?.scrollIntoView({ block: 'center', inline: 'nearest' });
      });
    });
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

  private applyUrlState() {
    const url = new URL(window.location.href);
    const path = normalizePathname(url.pathname);

    // /components/:slug
    const componentMatch = path.match(/^\/components\/([^/]+)$/);
    if (componentMatch) {
      const tag = tagFromComponentSlug(decodeURIComponent(componentMatch[1]));
      if (tag) {
        this.selectedTag = tag;
        this.activeNavTab = 'components';
        return;
      }
    }

    if (path === '/components' || path === '/') {
      this.activeNavTab = 'components';
      this.selectedTag = '';
      return;
    }

    // /resources and /resources/:id
    const resourcesMatch = path.match(/^\/resources(?:\/([^/]+))?$/);
    if (resourcesMatch) {
      const resourceId = resourcesMatch[1] ?? 'github';
      if (RESOURCE_ROUTE_IDS.has(resourceId) && GUIDE_PAGES[resourceId]) {
        this.selectedTag = resourceId;
        this.activeNavTab = 'resources';
        return;
      }
    }

    // /installation, /configuration, /styled-mode, …
    if (path.startsWith('/')) {
      const guideId = path.slice(1);
      if (GUIDE_ROUTE_IDS.has(guideId) && GUIDE_PAGES[guideId]) {
        this.selectedTag = guideId;
        this.activeNavTab = 'guides';
        return;
      }
    }
  }

  private routePathname(): string {
    if (this.activeNavTab === 'components') {
      if (!this.selectedTag || this.selectedTag === 'components') {
        return '/components';
      }
      if (this.definition) {
        return `/components/${componentSlugFromTag(this.selectedTag)}`;
      }
      return '/components';
    }

    if (this.activeNavTab === 'resources') {
      return this.selectedTag === 'github'
        ? '/resources'
        : `/resources/${this.selectedTag}`;
    }

    if (GUIDE_ROUTE_IDS.has(this.selectedTag)) {
      return `/${this.selectedTag}`;
    }

    return '/installation';
  }

  private syncUrl(options: { replace?: boolean } = {}) {
    const url = new URL(window.location.href);
    url.pathname = this.routePathname();
    url.searchParams.delete('component');

    const next = `${url.pathname}${url.search}${url.hash}`;
    const current = `${normalizePathname(window.location.pathname)}${window.location.search}${window.location.hash}`;
    const normalizedNext = `${normalizePathname(url.pathname)}${url.search}${url.hash}`;

    document.title = titleForRoute(this.activeNavTab, this.selectedTag);

    if (normalizedNext === current) {
      return;
    }

    if (options.replace) {
      history.replaceState(null, '', next);
    } else {
      history.pushState(null, '', next);
    }
  }

  private selectComponent(tag: string) {
    this.selectedTag = tag;
    this.navOpen = false;

    if (GUIDE_ROUTE_IDS.has(tag)) {
      this.activeNavTab = 'guides';
    } else if (RESOURCE_ROUTE_IDS.has(tag)) {
      this.activeNavTab = 'resources';
    } else if (
      getPlaygroundDefinition(tag) ||
      tag === '' ||
      tag === 'components'
    ) {
      this.activeNavTab = 'components';
    }

    this.syncUrl();
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
    if (this.isResetCoolingDown) {
      return;
    }

    const definition = this.definition;
    if (!definition) {
      return;
    }

    this.propsByTag = {
      ...this.propsByTag,
      [this.selectedTag]: { ...definition.defaults },
    };

    this.isResetCoolingDown = true;

    window.dispatchEvent(
      new CustomEvent('nui-toast-add', {
        detail: {
          severity: 'success',
          summary: 'Success',
          detail: 'Attributes have been reset',
          life: 2000,
        },
      }),
    );

    if (this.resetCooldownTimer !== null) {
      window.clearTimeout(this.resetCooldownTimer);
    }

    this.resetCooldownTimer = window.setTimeout(() => {
      this.isResetCoolingDown = false;
      this.resetCooldownTimer = null;
    }, 2000);
  }

  render() {
    const definition = this.definition;

    return html`
      ${
        this.selectedTag !== 'toast'
          ? html`<nui-toast position="top-right" style="--nui-toast-top: 70px;"></nui-toast>`
          : nothing
      }
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
            } else if (tab === 'components') {
              this.selectedTag = '';
            }
            this.syncUrl();
          },
          this.activeCategory,
          (category) => {
            this.activeCategory = category;
          },
        )}
        <main>
          ${
            this.activeNavTab !== 'components' && GUIDE_PAGES[this.selectedTag]
              ? renderGuidePage(GUIDE_PAGES[this.selectedTag])
              : !this.selectedTag || this.selectedTag === 'components'
                ? renderComponentsBrowser(
                    playgroundRegistry,
                    this.activeCategory,
                    (cat) => {
                      this.activeCategory = cat;
                    },
                    (tag) => this.selectComponent(tag),
                    this.componentSearch,
                    (query) => {
                      this.componentSearch = query;
                    },
                  )
                : definition
                  ? renderWorkspace(
                      definition,
                      this.currentProps,
                      (key, value) => this.updateProp(key, value),
                      () => this.resetProps(),
                      this.isResetCoolingDown,
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
    'docs-app': DocsApp;
  }
}
