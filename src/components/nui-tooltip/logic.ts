import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { TooltipCoords } from './tooltip-position.js';
import type { TooltipPosition } from './types.js';

export interface NuiTooltipViewState {
  value: string;
  disabled: boolean;
  tooltipId: string;
  tooltipClass: string;
  escape: boolean;
  position: TooltipPosition;
  visible: boolean;
  coords: TooltipCoords | null;
  nuiType: NuiType;
}

export function getTooltipClass(tooltipClass: string): string {
  return ['nui-tooltip', tooltipClass].filter(Boolean).join(' ');
}

export function getTooltipStyle(coords: TooltipCoords | null): string {
  if (!coords) {
    return '';
  }

  return `top:${coords.top}px;left:${coords.left}px`;
}

export function renderTooltip(state: NuiTooltipViewState): TemplateResult {
  return html`
    <span class="nui-tooltip-trigger">
      <slot></slot>
    </span>
    <div
      id=${state.tooltipId || nothing}
      class=${getTooltipClass(state.tooltipClass)}
      role="tooltip"
      position=${state.coords?.side ?? state.position}
      nui-type=${state.nuiType || nothing}
      style=${getTooltipStyle(state.coords)}
      ?visible=${state.visible || nothing}
      aria-hidden=${state.visible ? 'false' : 'true'}
    >
      <span class="nui-tooltip-arrow" aria-hidden="true"></span>
      <span class="nui-tooltip-text">${state.value}</span>
    </div>
  `;
}
