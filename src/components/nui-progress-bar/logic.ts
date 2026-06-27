import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { ProgressBarMode } from './types.js';

export interface NuiProgressBarViewState {
  value: number;
  mode: ProgressBarMode;
  showValue: boolean;
  width: string;
  height: string;
  nuiType: NuiType;
  progressBarClass: string;
}

export function getProgressBarClass(progressBarClass: string): string {
  return ['nui-progress-bar', progressBarClass].filter(Boolean).join(' ');
}

export function clampProgressValue(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 100);
}

export function getHostStyle(
  width: string,
  height: string,
): string | undefined {
  const parts = [
    width.trim() ? `width:${width.trim()}` : '',
    height.trim() ? `height:${height.trim()}` : '',
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(';') : undefined;
}

function shouldShowLabel(
  value: number,
  showValue: boolean,
  mode: ProgressBarMode,
): boolean {
  if (!showValue) {
    return false;
  }

  if (mode === 'indeterminate') {
    return true;
  }

  return value !== 0;
}

export function renderProgressBar(
  state: NuiProgressBarViewState,
): TemplateResult {
  const value = clampProgressValue(state.value);
  const isIndeterminate = state.mode === 'indeterminate';
  const valueStyle = !isIndeterminate ? `width:${value}%` : nothing;

  return html`
    <div
      class=${getProgressBarClass(state.progressBarClass)}
      role="progressbar"
      mode=${state.mode}
      nui-type=${state.nuiType || nothing}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${!isIndeterminate ? value : nothing}
      aria-busy=${isIndeterminate ? 'true' : nothing}
    >
      <div class="nui-progress-bar-value" style=${valueStyle}></div>
      ${
        shouldShowLabel(value, state.showValue, state.mode)
          ? html`
              <div class="nui-progress-bar-label">
                <slot>${value}%</slot>
              </div>
            `
          : nothing
      }
    </div>
  `;
}
