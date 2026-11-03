import '../../components/nui-scroll-panel/nui-scroll-panel.js';
import { html, type TemplateResult } from 'lit';
import type { PlaygroundDefinition } from '../types.js';

export type NavTabId = 'guides' | 'components' | 'resources';

export interface NavSection {
  title: string;
  items: {
    id: string;
    label: string;
    tag?: string;
    badge?: string;
  }[];
}

export const NAV_TABS: { id: NavTabId; label: string; icon: TemplateResult }[] =
  [
    {
      id: 'guides',
      label: 'Guides',
      icon: html`
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
        <path d="M6 6h10"></path>
        <path d="M6 10h10"></path>
      </svg>
    `,
    },
    {
      id: 'components',
      label: 'Components',
      icon: html`
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"></rect>
        <rect x="14" y="3" width="7" height="7" rx="1"></rect>
        <rect x="14" y="14" width="7" height="7" rx="1"></rect>
        <rect x="3" y="14" width="7" height="7" rx="1"></rect>
      </svg>
    `,
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: html`
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
      </svg>
    `,
    },
  ];

export const GUIDES_SECTIONS: NavSection[] = [
  {
    title: 'GETTING STARTED',
    items: [
      { id: 'installation', label: 'Installation' },
      { id: 'configuration', label: 'Configuration' },
    ],
  },
  {
    title: 'THEMING',
    items: [
      { id: 'styled-mode', label: 'Styled Mode' },
      { id: 'unstyled-mode', label: 'Unstyled Mode' },
      { id: 'isolated-mode', label: 'Isolated Mode' },
    ],
  },
];

export const RESOURCES_SECTIONS: NavSection[] = [
  {
    title: 'COMMUNITY & SUPPORT',
    items: [
      { id: 'github', label: 'GitHub Repository' },
      { id: 'discord', label: 'Discord Server' },
      { id: 'contributing', label: 'Contributing' },
      { id: 'code-of-conduct', label: 'Code of Conduct' },
      { id: 'license', label: 'License' },
      { id: 'security', label: 'Security' },
    ],
  },
];

export function buildComponentSections(
  definitions: PlaygroundDefinition[],
): NavSection[] {
  const formTags = new Set([
    'nui-auto-complete',
    'nui-checkbox',
    'nui-color-picker',
    'nui-date-picker',
    'nui-float-label',
    'nui-input-mask',
    'nui-input-number',
    'nui-input-otp',
    'nui-input-text',
    'nui-knob',
    'nui-listbox',
    'nui-password',
    'nui-radio-button',
    'nui-rating',
    'nui-select',
    'nui-select-button',
    'nui-slider',
    'nui-textarea',
  ]);

  const buttonTags = new Set(['nui-button', 'nui-speed-dial', 'nui-anchor']);

  const panelTags = new Set([
    'nui-accordion',
    'nui-card',
    'nui-divider',
    'nui-scroll-panel',
    'nui-tabs',
    'nui-terminal',
    'nui-tile',
  ]);

  const overlayTags = new Set(['nui-dialog', 'nui-popover', 'nui-tooltip']);

  const menuTags = new Set(['nui-dock', 'nui-menu', 'nui-tree']);

  const mediaTags = new Set([
    'nui-avatar',
    'nui-badge',
    'nui-chart',
    'nui-heading',
    'nui-icon',
    'nui-image',
    'nui-logo',
    'nui-paragraph',
    'nui-skeleton',
    'nui-swiper',
    'nui-tag',
  ]);

  const sections: NavSection[] = [
    {
      title: 'FORM',
      items: definitions
        .filter((d) => formTags.has(d.tag))
        .map((d) => ({ id: d.tag, label: d.label, tag: d.tag })),
    },
    {
      title: 'BUTTON',
      items: definitions
        .filter((d) => buttonTags.has(d.tag))
        .map((d) => ({ id: d.tag, label: d.label, tag: d.tag })),
    },
    {
      title: 'DATA',
      items: definitions
        .filter((d) => d.tag === 'nui-data-table')
        .map((d) => ({ id: d.tag, label: d.label, tag: d.tag })),
    },
    {
      title: 'PANEL',
      items: definitions
        .filter((d) => panelTags.has(d.tag))
        .map((d) => ({ id: d.tag, label: d.label, tag: d.tag })),
    },
    {
      title: 'OVERLAY',
      items: definitions
        .filter((d) => overlayTags.has(d.tag))
        .map((d) => ({ id: d.tag, label: d.label, tag: d.tag })),
    },
    {
      title: 'MENU',
      items: definitions
        .filter((d) => menuTags.has(d.tag))
        .map((d) => ({ id: d.tag, label: d.label, tag: d.tag })),
    },
    {
      title: 'MEDIA & DISPLAY',
      items: definitions
        .filter((d) => mediaTags.has(d.tag))
        .map((d) => ({ id: d.tag, label: d.label, tag: d.tag })),
    },
  ];

  // Any remaining components not yet placed in a group
  const covered = new Set(
    sections.flatMap((s) => s.items.map((i) => i.tag).filter(Boolean)),
  );
  const others = definitions.filter((d) => !covered.has(d.tag));
  if (others.length > 0) {
    sections.push({
      title: 'MISC',
      items: others.map((d) => ({ id: d.tag, label: d.label, tag: d.tag })),
    });
  }

  return sections;
}

export function renderNav(
  definitions: PlaygroundDefinition[],
  selectedTag: string,
  onSelect: (tag: string) => void,
  open: boolean,
  onClose: () => void,
  activeTab: NavTabId = 'components',
  onTabChange?: (tab: NavTabId) => void,
): TemplateResult {
  const sections: NavSection[] =
    activeTab === 'guides'
      ? GUIDES_SECTIONS
      : activeTab === 'resources'
        ? RESOURCES_SECTIONS
        : buildComponentSections(definitions);

  return html`
    <div
      class="nav-backdrop ${open ? 'is-open' : ''}"
      @click=${onClose}
    ></div>
    <aside class="${open ? 'is-open' : ''}">
      <div class="nav-header">
        <span class="nav-header-title">Menu</span>
        <button
          class="nav-close"
          type="button"
          aria-label="Close menu"
          @click=${onClose}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="nav-top-tabs">
        ${NAV_TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return html`
            <button
              class="nav-top-tab ${isActive ? 'is-active' : ''}"
              type="button"
              @click=${() => onTabChange?.(tab.id)}
            >
              ${isActive ? html`<span class="nav-top-tab-indicator"></span>` : ''}
              <span class="nav-top-tab-icon">${tab.icon}</span>
              <span class="nav-top-tab-label">${tab.label}</span>
            </button>
          `;
        })}
      </div>

      <div class="nav-divider"></div>

      <nui-scroll-panel class="nav-scroll-panel">
        <nav class="nav-items-scroll">
          ${sections.map(
            (section) => html`
              <div class="nav-group">
                <div class="nav-group-title">${section.title}</div>
                <div class="nav-group-items">
                  ${section.items.map((item) => {
                    const isSelected =
                      item.tag != null
                        ? item.tag === selectedTag
                        : item.id === selectedTag;

                    return html`
                      <button
                        class="nav-item ${isSelected ? 'is-selected' : ''}"
                        type="button"
                        @click=${() => {
                          if (item.tag) {
                            onSelect(item.tag);
                          } else {
                            onSelect(item.id);
                          }
                        }}
                      >
                        <span class="nav-item-label">${item.label}</span>
                        ${
                          item.badge
                            ? html`<span class="nav-item-badge">${item.badge}</span>`
                            : ''
                        }
                      </button>
                    `;
                  })}
                </div>
              </div>
            `,
          )}
        </nav>
      </nui-scroll-panel>
    </aside>
  `;
}
