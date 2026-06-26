import { nuiAvatarPlayground } from './definitions/nui-avatar.js';
import { nuiBadgePlayground } from './definitions/nui-badge.js';
import { nuiButtonPlayground } from './definitions/nui-button.js';
import { nuiCheckboxPlayground } from './definitions/nui-checkbox.js';
import { nuiDividerPlayground } from './definitions/nui-divider.js';
import { nuiIconPlayground } from './definitions/nui-icon.js';
import { nuiImagePlayground } from './definitions/nui-image.js';
import { nuiInputMaskPlayground } from './definitions/nui-input-mask.js';
import { nuiInputNumberPlayground } from './definitions/nui-input-number.js';
import { nuiInputOtpPlayground } from './definitions/nui-input-otp.js';
import { nuiInputTextPlayground } from './definitions/nui-input-text.js';
import { nuiKnobPlayground } from './definitions/nui-knob.js';
import { nuiLabelPlayground } from './definitions/nui-label.js';
import { nuiSkeletonPlayground } from './definitions/nui-skeleton.js';
import { nuiSliderPlayground } from './definitions/nui-slider.js';
import { nuiTagPlayground } from './definitions/nui-tag.js';
import { nuiTextareaPlayground } from './definitions/nui-textarea.js';
import type { PlaygroundDefinition, PlaygroundProps } from './types.js';

export const playgroundRegistry: PlaygroundDefinition[] = [
  nuiAvatarPlayground,
  nuiBadgePlayground,
  nuiButtonPlayground,
  nuiCheckboxPlayground,
  nuiDividerPlayground,
  nuiIconPlayground,
  nuiImagePlayground,
  nuiInputMaskPlayground,
  nuiInputNumberPlayground,
  nuiInputOtpPlayground,
  nuiInputTextPlayground,
  nuiKnobPlayground,
  nuiLabelPlayground,
  nuiSkeletonPlayground,
  nuiSliderPlayground,
  nuiTagPlayground,
  nuiTextareaPlayground,
];

export function getPlaygroundDefinition(
  tag: string,
): PlaygroundDefinition | undefined {
  return playgroundRegistry.find((definition) => definition.tag === tag);
}

export function createInitialPropsState(): Record<string, PlaygroundProps> {
  const state: Record<string, PlaygroundProps> = {};

  for (const definition of playgroundRegistry) {
    state[definition.tag] = { ...definition.defaults };
  }

  return state;
}
