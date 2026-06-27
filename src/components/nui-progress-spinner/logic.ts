import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';

export interface NuiProgressSpinnerViewState {
  strokeWidth: string;
  fill: string;
  animationDuration: string;
  width: string;
  height: string;
  nuiType: NuiType;
  progressSpinnerClass: string;
}

export function getProgressSpinnerClass(progressSpinnerClass: string): string {
  return ['nui-progress-spinner', progressSpinnerClass]
    .filter(Boolean)
    .join(' ');
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

export function renderProgressSpinner(
  state: NuiProgressSpinnerViewState,
): TemplateResult {
  const spinStyle = state.animationDuration.trim()
    ? `animation-duration:${state.animationDuration.trim()}`
    : nothing;

  return html`
    <div
      class=${getProgressSpinnerClass(state.progressSpinnerClass)}
      role="progressbar"
      nui-type=${state.nuiType || nothing}
    >
      <svg
        class="nui-progress-spinner-spin"
        viewBox="25 25 50 50"
        style=${spinStyle}
      >
        <circle
          class="nui-progress-spinner-circle"
          cx="50"
          cy="50"
          r="20"
          fill=${state.fill || 'none'}
          stroke-width=${state.strokeWidth || '2'}
          stroke-miterlimit="10"
        ></circle>
      </svg>
    </div>
  `;
}
