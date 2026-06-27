import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';

export const DEFAULT_RATING_ON_ICON = 'mdi:star';
export const DEFAULT_RATING_OFF_ICON = 'mdi:star-outline';

export interface NuiRatingViewState {
  value: number;
  name: string;
  stars: number;
  disabled: boolean;
  readonly: boolean;
  invalid: boolean;
  onIcon: string;
  offIcon: string;
  nuiType: NuiType;
  ratingClass: string;
}

export function getRatingClass(ratingClass: string): string {
  return ['nui-rating', ratingClass].filter(Boolean).join(' ');
}

export function clampStars(stars: number): number {
  if (!Number.isFinite(stars) || stars < 1) {
    return 1;
  }

  return Math.min(Math.floor(stars), 20);
}

export function clampRatingValue(value: number, stars: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.min(Math.floor(value), stars);
}

export function getStarIndices(stars: number): number[] {
  const count = clampStars(stars);

  return Array.from({ length: count }, (_, index) => index + 1);
}

export function getNextRatingValue(current: number, selected: number): number {
  return current === selected ? 0 : selected;
}

export function getRatingIcon(
  star: number,
  value: number,
  onIcon: string,
  offIcon: string,
): string {
  return star <= value
    ? onIcon.trim() || DEFAULT_RATING_ON_ICON
    : offIcon.trim() || DEFAULT_RATING_OFF_ICON;
}

export function getRatingGroupName(name: string, hostId: string): string {
  return name.trim() || hostId || 'nui-rating';
}

export function getStarAriaLabel(star: number): string {
  return star === 1 ? '1 star' : `${star} stars`;
}

export function renderRating(
  state: NuiRatingViewState,
  groupName: string,
  onOptionClick: (event: Event, star: number) => void,
  onOptionChange: (event: Event, star: number) => void,
): TemplateResult {
  const stars = clampStars(state.stars);
  const value = clampRatingValue(state.value, stars);
  const isInteractive = !state.disabled && !state.readonly;

  return html`
    <div
      class=${getRatingClass(state.ratingClass)}
      role="radiogroup"
      nui-type=${state.nuiType || nothing}
      ?disabled=${state.disabled || nothing}
      ?readonly=${state.readonly || nothing}
      ?invalid=${state.invalid || nothing}
    >
      ${getStarIndices(stars).map(
        (star) => html`
          <span
            class="nui-rating-option"
            ?active=${star <= value || nothing}
            @click=${
              isInteractive
                ? (event: Event) => onOptionClick(event, star)
                : nothing
            }
          >
            <span class="nui-rating-hidden-input">
              <input
                type="radio"
                name=${groupName}
                .value=${String(star)}
                .checked=${value === star}
                ?disabled=${state.disabled || nothing}
                ?readonly=${state.readonly || nothing}
                aria-label=${getStarAriaLabel(star)}
                @change=${(event: Event) => onOptionChange(event, star)}
              />
            </span>
            <nui-icon
              class="nui-rating-icon"
              icon=${getRatingIcon(star, value, state.onIcon, state.offIcon)}
              width="1.25rem"
              height="1.25rem"
              aria-hidden="true"
            ></nui-icon>
          </span>
        `,
      )}
    </div>
  `;
}
