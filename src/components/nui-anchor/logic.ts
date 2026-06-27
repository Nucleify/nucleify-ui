import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { ImageFetchPriority } from '../nui-image/types.js';
import type { AnchorRel, AnchorTarget } from './types.js';

export interface NuiAnchorViewState {
  href: string;
  rel: AnchorRel;
  target: AnchorTarget;
  icon: string;
  size: string;
  src: string;
  alt: string;
  label: string;
  tooltip: string;
  fetchpriority: ImageFetchPriority | '';
  anchorClass: string;
  itemClass: string;
  anchorStyle: string;
  nuiType: NuiType;
}

export function getAnchorClass(anchorClass: string): string {
  return ['nui-anchor', anchorClass].filter(Boolean).join(' ');
}

function renderAnchorLink(state: NuiAnchorViewState): TemplateResult {
  const iconSize = state.size || '1em';

  return html`
    <a
      class=${getAnchorClass(state.anchorClass)}
      href=${state.href || '#'}
      rel=${state.rel || nothing}
      target=${state.target || nothing}
      style=${state.anchorStyle || nothing}
      nui-type=${state.nuiType || nothing}
    >
      <slot></slot>
      ${
        state.icon
          ? html`
              <nui-icon
                class=${state.itemClass || nothing}
                icon=${state.icon}
                width=${iconSize}
                height=${iconSize}
                nui-type=${state.nuiType || nothing}
                aria-hidden="true"
              ></nui-icon>
            `
          : nothing
      }
      ${
        state.src
          ? html`
              <nui-image
                class=${state.itemClass || nothing}
                src=${state.src}
                alt=${state.alt || nothing}
                fetchpriority=${state.fetchpriority || nothing}
                nui-type=${state.nuiType || nothing}
              ></nui-image>
            `
          : nothing
      }
      ${
        state.label
          ? html`
              <nui-label
                class=${state.itemClass || nothing}
                value=${state.label}
                nui-type=${state.nuiType || nothing}
              ></nui-label>
            `
          : nothing
      }
    </a>
  `;
}

export function renderAnchor(state: NuiAnchorViewState): TemplateResult {
  const link = renderAnchorLink(state);

  if (!state.tooltip) {
    return link;
  }

  return html`
    <nui-tooltip value=${state.tooltip} nui-type=${state.nuiType || nothing}>
      ${link}
    </nui-tooltip>
  `;
}
