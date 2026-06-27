import '../nui-icon/nui-icon.js';
import '../nui-paragraph/nui-paragraph.js';
import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import { formatSecondaryCount, formatTileCount } from './tile-format.js';

export interface NuiTileViewState {
  href: string;
  header: string;
  count: string | number;
  countSecondary: number | string;
  textSecondary: string;
  icon: string;
  tileClass: string;
  nuiType: NuiType;
}

export function getTileClass(tileClass: string): string {
  return ['nui-tile', tileClass].filter(Boolean).join(' ');
}

export function renderTile(state: NuiTileViewState): TemplateResult {
  const secondaryCount = formatSecondaryCount(state.countSecondary);
  const mainCount = formatTileCount(state.count);

  return html`
    <a
      class=${getTileClass(state.tileClass)}
      href=${state.href || '#'}
      nui-type=${state.nuiType || nothing}
    >
      <div class="nui-tile-general">
        <div class="nui-tile-info">
          <nui-paragraph
            class="nui-tile-header"
            text=${state.header || nothing}
            nui-type=${state.nuiType || nothing}
            unstyled
          ></nui-paragraph>
          <nui-paragraph
            class="nui-tile-count"
            text=${mainCount || nothing}
            nui-type=${state.nuiType || nothing}
            unstyled
          ></nui-paragraph>
        </div>
        ${
          state.icon
            ? html`
                <div class="nui-tile-icon-container">
                  <nui-icon
                    class="nui-tile-icon"
                    icon=${state.icon}
                    width="1.5em"
                    height="1.5em"
                    nui-type=${state.nuiType || nothing}
                    aria-hidden="true"
                  ></nui-icon>
                </div>
              `
            : nothing
        }
      </div>
      <div class="nui-tile-secondary">
        <nui-paragraph
          class="nui-tile-count-secondary"
          text=${secondaryCount || nothing}
          nui-type=${state.nuiType || nothing}
          unstyled
        ></nui-paragraph>
        <nui-paragraph
          class="nui-tile-text-secondary"
          text=${state.textSecondary || nothing}
          nui-type=${state.nuiType || nothing}
          unstyled
        ></nui-paragraph>
      </div>
      <slot></slot>
    </a>
  `;
}
