import '../../components/nui-button/nui-button.js';
import '../../components/nui-heading/nui-heading.js';
import '../../components/nui-icon/nui-icon.js';
import { html, nothing, type TemplateResult } from 'lit';
import {
  COMPONENT_CATEGORIES,
  type ComponentCategoryId,
  getComponentCategory,
  getComponentIcon,
} from '../categories.js';
import type { PlaygroundDefinition } from '../types.js';

export function renderComponentsBrowser(
  definitions: PlaygroundDefinition[],
  activeCategory: ComponentCategoryId,
  onCategoryChange: (cat: ComponentCategoryId) => void,
  onSelect: (tag: string) => void,
  searchQuery = '',
  onSearchChange?: (query: string) => void,
): TemplateResult {
  const query = searchQuery.trim().toLowerCase();

  const visible = definitions.filter((item) => {
    if (
      activeCategory !== 'all' &&
      getComponentCategory(item.tag) !== activeCategory
    ) {
      return false;
    }
    if (query) {
      const matchTag = item.tag.toLowerCase().includes(query);
      const matchLabel = item.label.toLowerCase().includes(query);
      const matchDesc =
        item.description?.toLowerCase().includes(query) ?? false;
      return matchTag || matchLabel || matchDesc;
    }
    return true;
  });

  return html`
    <div class="components-browser">
      <div class="components-browser-header">
        <span class="components-browser-eyebrow">Component Library</span>
        <nui-heading
          tag="2"
          class="components-browser-title"
          text="50+ production-ready primitives"
          unstyled
        ></nui-heading>
        <p class="components-browser-lead">
          Forms, data, layout, and feedback. Filter by domain or keyword, then open any
          component docs page to inspect attributes, slots, and events.
        </p>
      </div>

      <div class="browser-search-wrap">
        <nui-icon icon="mdi:magnify" width="18" height="18" class="browser-search-icon"></nui-icon>
        <input
          type="text"
          class="browser-search-input"
          placeholder="Search components (e.g. otp, table, button, dialog)..."
          .value=${searchQuery}
          @input=${(e: Event) => onSearchChange?.((e.target as HTMLInputElement).value)}
        />
        <div class="browser-search-actions">
          ${
            searchQuery
              ? html`
                  <button
                    type="button"
                    class="browser-search-clear"
                    aria-label="Clear search"
                    @click=${() => onSearchChange?.('')}
                  >
                    <nui-icon icon="mdi:close" width="14" height="14"></nui-icon>
                  </button>
                `
              : html`<kbd class="browser-search-kbd">/</kbd>`
          }
        </div>
      </div>

      <div class="browser-categories">
        ${COMPONENT_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return html`
            <nui-button
              label=${cat.label}
              severity=${isActive ? 'primary' : 'secondary'}
              size="small"
              ?outlined=${!isActive}
              @click=${() => onCategoryChange(cat.id)}
            ></nui-button>
          `;
        })}
      </div>

      <div class="browser-meta">
        <span class="browser-count">
          Showing <strong>${visible.length}</strong> of ${definitions.length} components
          ${
            query
              ? html` for <em class="browser-query">"${searchQuery}"</em>`
              : nothing
          }
        </span>
      </div>

      ${
        visible.length === 0
          ? html`
              <div class="browser-empty-state">
                <nui-icon icon="mdi:file-search-outline" width="36" height="36"></nui-icon>
                <p>No components found matching <strong>"${searchQuery}"</strong>.</p>
                <nui-button
                  label="Clear filter"
                  size="small"
                  severity="secondary"
                  outlined
                  @click=${() => {
                    onSearchChange?.('');
                    onCategoryChange('all');
                  }}
                ></nui-button>
              </div>
            `
          : html`
              <div class="browser-grid">
                ${visible.map((item) => {
                  const icon = getComponentIcon(item.tag);
                  return html`
                    <button
                      class="browser-item"
                      type="button"
                      @click=${() => onSelect(item.tag)}
                    >
                      <div class="browser-item-icon">
                        <nui-icon icon=${icon} width="18" height="18"></nui-icon>
                      </div>
                      <span class="browser-item-name">${item.tag}</span>
                      <nui-icon
                        icon="mdi:arrow-top-right"
                        width="14"
                        height="14"
                        class="browser-item-arrow"
                      ></nui-icon>
                    </button>
                  `;
                })}
              </div>
            `
      }
    </div>
  `;
}
