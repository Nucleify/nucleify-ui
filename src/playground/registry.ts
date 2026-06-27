import { nuiAccordionPlayground } from './definitions/nui-accordion.js';
import { nuiAnchorPlayground } from './definitions/nui-anchor.js';
import { nuiAutoCompletePlayground } from './definitions/nui-auto-complete.js';
import { nuiAvatarPlayground } from './definitions/nui-avatar.js';
import { nuiBadgePlayground } from './definitions/nui-badge.js';
import { nuiButtonPlayground } from './definitions/nui-button.js';
import { nuiCardPlayground } from './definitions/nui-card.js';
import { nuiChartPlayground } from './definitions/nui-chart.js';
import { nuiCheckboxPlayground } from './definitions/nui-checkbox.js';
import { nuiColorPickerPlayground } from './definitions/nui-color-picker.js';
import { nuiDataTablePlayground } from './definitions/nui-data-table.js';
import { nuiDatePickerPlayground } from './definitions/nui-date-picker.js';
import { nuiDividerPlayground } from './definitions/nui-divider.js';
import { nuiFloatLabelPlayground } from './definitions/nui-float-label.js';
import { nuiHeadingPlayground } from './definitions/nui-heading.js';
import { nuiIconPlayground } from './definitions/nui-icon.js';
import { nuiImagePlayground } from './definitions/nui-image.js';
import { nuiInputMaskPlayground } from './definitions/nui-input-mask.js';
import { nuiInputNumberPlayground } from './definitions/nui-input-number.js';
import { nuiInputOtpPlayground } from './definitions/nui-input-otp.js';
import { nuiInputTextPlayground } from './definitions/nui-input-text.js';
import { nuiKnobPlayground } from './definitions/nui-knob.js';
import { nuiLabelPlayground } from './definitions/nui-label.js';
import { nuiListboxPlayground } from './definitions/nui-listbox.js';
import { nuiLogoPlayground } from './definitions/nui-logo.js';
import { nuiParagraphPlayground } from './definitions/nui-paragraph.js';
import { nuiProgressBarPlayground } from './definitions/nui-progress-bar.js';
import { nuiProgressSpinnerPlayground } from './definitions/nui-progress-spinner.js';
import { nuiRadioButtonPlayground } from './definitions/nui-radio-button.js';
import { nuiRatingPlayground } from './definitions/nui-rating.js';
import { nuiScrollTopPlayground } from './definitions/nui-scroll-top.js';
import { nuiSelectButtonPlayground } from './definitions/nui-select-button.js';
import { nuiSkeletonPlayground } from './definitions/nui-skeleton.js';
import { nuiSliderPlayground } from './definitions/nui-slider.js';
import { nuiTagPlayground } from './definitions/nui-tag.js';
import { nuiTextareaPlayground } from './definitions/nui-textarea.js';
import { nuiTilePlayground } from './definitions/nui-tile.js';
import { nuiTooltipPlayground } from './definitions/nui-tooltip.js';
import type { PlaygroundDefinition, PlaygroundProps } from './types.js';

export const playgroundRegistry: PlaygroundDefinition[] = [
  nuiAccordionPlayground,
  nuiAutoCompletePlayground,
  nuiAnchorPlayground,
  nuiAvatarPlayground,
  nuiBadgePlayground,
  nuiButtonPlayground,
  nuiCardPlayground,
  nuiChartPlayground,
  nuiCheckboxPlayground,
  nuiColorPickerPlayground,
  nuiDataTablePlayground,
  nuiDatePickerPlayground,
  nuiDividerPlayground,
  nuiFloatLabelPlayground,
  nuiHeadingPlayground,
  nuiIconPlayground,
  nuiImagePlayground,
  nuiInputMaskPlayground,
  nuiInputNumberPlayground,
  nuiInputOtpPlayground,
  nuiInputTextPlayground,
  nuiKnobPlayground,
  nuiLabelPlayground,
  nuiListboxPlayground,
  nuiLogoPlayground,
  nuiParagraphPlayground,
  nuiProgressBarPlayground,
  nuiProgressSpinnerPlayground,
  nuiRadioButtonPlayground,
  nuiRatingPlayground,
  nuiScrollTopPlayground,
  nuiSelectButtonPlayground,
  nuiSkeletonPlayground,
  nuiSliderPlayground,
  nuiTagPlayground,
  nuiTextareaPlayground,
  nuiTilePlayground,
  nuiTooltipPlayground,
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
