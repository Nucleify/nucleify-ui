import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import type { SkeletonAnimation, SkeletonShape } from './types.js';

export interface NuiSkeletonViewState {
  shape: SkeletonShape | '';
  size: string;
  width: string;
  height: string;
  borderRadius: string;
  animation: SkeletonAnimation | '';
  nuiType: NuiType;
  skeletonClass: string;
}

export function getSkeletonClass(skeletonClass: string): string {
  return ['nui-skeleton', skeletonClass].filter(Boolean).join(' ');
}

export function resolveSkeletonAnimation(
  animation: SkeletonAnimation | '',
): SkeletonAnimation {
  return animation || 'wave';
}

export function resolveSkeletonShape(shape: SkeletonShape | ''): SkeletonShape {
  return shape || 'rectangle';
}

export function getSkeletonInlineStyle(
  state: Pick<
    NuiSkeletonViewState,
    'size' | 'width' | 'height' | 'borderRadius' | 'shape'
  >,
): string {
  const styles: string[] = [];
  const shape = resolveSkeletonShape(state.shape);

  if (state.size) {
    styles.push(`width:${state.size}`, `height:${state.size}`);
  } else {
    styles.push(
      `width:${state.width || '100%'}`,
      `height:${state.height || '1rem'}`,
    );
  }

  if (state.borderRadius) {
    styles.push(`border-radius:${state.borderRadius}`);
  } else if (shape === 'circle') {
    styles.push('border-radius:50%');
  }

  return styles.join(';');
}

export function renderSkeleton(state: NuiSkeletonViewState): TemplateResult {
  const animation = resolveSkeletonAnimation(state.animation);
  const shape = resolveSkeletonShape(state.shape);
  const inlineStyle = getSkeletonInlineStyle(state);

  return html`
    <div
      class=${getSkeletonClass(state.skeletonClass)}
      shape=${shape}
      animation=${animation}
      nui-type=${state.nuiType || nothing}
      style=${inlineStyle}
      aria-hidden="true"
    ></div>
  `;
}
