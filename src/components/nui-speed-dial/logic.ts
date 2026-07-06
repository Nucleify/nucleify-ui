import { html, nothing, type TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import type {
  SpeedDialDirection,
  SpeedDialMenuItem,
  SpeedDialProps,
  SpeedDialType,
} from './types.js';

const MATH_PI = Math.PI;

export interface NuiSpeedDialViewState extends SpeedDialProps {
  open: boolean;
  listId: string;
}

export interface NuiSpeedDialHandlers {
  onToggle: (event: Event) => void;
  onItemClick: (item: SpeedDialMenuItem, event: MouseEvent) => void;
  onListKeyDown: (event: KeyboardEvent) => void;
  onButtonKeyDown: (event: KeyboardEvent) => void;
}

function isItemVisible(item: SpeedDialMenuItem): boolean {
  if (typeof item.visible === 'function') {
    return item.visible();
  }

  return item.visible !== false;
}

function calculateTransitionDelay(
  index: number,
  total: number,
  open: boolean,
  stepMs: number,
): string {
  const delay = (open ? index : total - index - 1) * stepMs;
  return `${delay}ms`;
}

function polarToCenterStyle(
  offsetX: number,
  offsetY: number,
): Record<string, string> {
  return {
    left: `calc(50% + ${offsetX}px)`,
    top: `calc(50% + ${offsetY}px)`,
  };
}

function getSemiCircleStartAngle(direction: SpeedDialDirection): number {
  switch (direction) {
    case 'down':
      return 0;
    case 'up':
      return MATH_PI;
    case 'left':
      return MATH_PI / 2;
    case 'right':
      return -MATH_PI / 2;
    default:
      return MATH_PI;
  }
}

function getQuarterCircleStartAngle(direction: SpeedDialDirection): number {
  switch (direction) {
    case 'down-right':
      return 0;
    case 'down-left':
      return MATH_PI / 2;
    case 'up-left':
      return MATH_PI;
    case 'up-right':
      return (3 * MATH_PI) / 2;
    default:
      return 0;
  }
}

function calculatePointStyle(
  type: SpeedDialType,
  direction: SpeedDialDirection,
  index: number,
  total: number,
  radius: number,
): Record<string, string> {
  if (type === 'linear' || total === 0) {
    return {};
  }

  const effectiveRadius = radius || total * 20;

  if (type === 'circle') {
    const angle = (2 * MATH_PI * index) / total;

    return polarToCenterStyle(
      effectiveRadius * Math.cos(angle),
      effectiveRadius * Math.sin(angle),
    );
  }

  if (type === 'semi-circle') {
    const step = MATH_PI / Math.max(total - 1, 1);
    const angle = getSemiCircleStartAngle(direction) + step * index;

    return polarToCenterStyle(
      effectiveRadius * Math.cos(angle),
      effectiveRadius * Math.sin(angle),
    );
  }

  if (type === 'quarter-circle') {
    const step = MATH_PI / (2 * Math.max(total - 1, 1));
    const angle = getQuarterCircleStartAngle(direction) + step * index;

    return polarToCenterStyle(
      effectiveRadius * Math.cos(angle),
      effectiveRadius * Math.sin(angle),
    );
  }

  return {};
}

function calculateItemStyle(
  state: NuiSpeedDialViewState,
  index: number,
  total: number,
): Record<string, string> {
  const stepMs = state.transitionDelay ?? 30;
  const pointStyle = calculatePointStyle(
    state.type ?? 'linear',
    state.direction ?? 'up',
    index,
    total,
    state.radius ?? 0,
  );
  const isRadial = state.type !== 'linear';

  return {
    transitionDelay: calculateTransitionDelay(index, total, state.open, stepMs),
    ...pointStyle,
    ...(isRadial
      ? {
          transform: state.open
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0.4)',
        }
      : {}),
  };
}

function renderActionIcon(icon: string): TemplateResult {
  return html`
    <span class="nui-speed-dial-icon-wrap nui-speed-dial-action-icon-wrap">
      <nui-icon icon=${icon} aria-hidden="true"></nui-icon>
    </span>
  `;
}

export function renderSpeedDial(
  state: NuiSpeedDialViewState,
  handlers: NuiSpeedDialHandlers,
): TemplateResult {
  const visibleItems = state.model.filter(isItemVisible);
  const direction = state.direction ?? 'up';
  const type = state.type ?? 'linear';
  const rotateAnimation = state.rotateAnimation !== false;
  const showRotate = rotateAnimation && !state.hideIcon;

  const containerClass = [
    'nui-speed-dial',
    `nui-speed-dial-direction-${direction}`,
    `nui-speed-dial-type-${type}`,
    state.open ? 'nui-speed-dial-open' : '',
    state.speedDialClass,
  ]
    .filter(Boolean)
    .join(' ');

  const buttonClass = [
    'nui-speed-dial-button',
    state.buttonClass,
    state.open ? 'nui-speed-dial-open' : '',
    showRotate ? 'nui-speed-dial-button-rotate' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const currentIcon =
    state.open && state.hideIcon
      ? state.hideIcon
      : state.showIcon || 'mdi:plus';

  return html`
    ${
      state.mask
        ? html`<div
          class="nui-speed-dial-mask ${state.open ? 'nui-speed-dial-mask-visible' : ''} ${state.maskClass || ''}"
          @click=${(e: Event) => {
            e.stopPropagation();
            if (state.open) {
              handlers.onToggle(e);
            }
          }}
        ></div>`
        : nothing
    }

    <div class=${containerClass} nui-type=${state.nuiType || nothing}>
      <ul
        id=${state.listId}
        class="nui-speed-dial-list"
        role="menu"
        tabindex="-1"
        @keydown=${handlers.onListKeyDown}
      >
        ${visibleItems.map((item, index) => {
          const itemStyle = calculateItemStyle(
            state,
            index,
            visibleItems.length,
          );

          return html`
            <li
              class="nui-speed-dial-item"
              style=${styleMap(itemStyle)}
              role="none"
            >
              <button
                type="button"
                role="menuitem"
                class="nui-speed-dial-action"
                title=${item.label || nothing}
                aria-label=${item.label || nothing}
                ?disabled=${item.disabled || state.disabled}
                @click=${(e: MouseEvent) => handlers.onItemClick(item, e)}
              >
                ${item.icon ? renderActionIcon(item.icon) : nothing}
              </button>
            </li>
          `;
        })}
      </ul>

      <button
        type="button"
        class=${buttonClass}
        ?disabled=${state.disabled}
        aria-expanded=${state.open ? 'true' : 'false'}
        aria-haspopup="menu"
        aria-controls=${state.listId}
        aria-label=${state.ariaLabel || nothing}
        @click=${handlers.onToggle}
        @keydown=${handlers.onButtonKeyDown}
      >
        <span class="nui-speed-dial-icon-wrap nui-speed-dial-button-icon-wrap">
          <nui-icon icon=${currentIcon} aria-hidden="true"></nui-icon>
        </span>
      </button>
    </div>
  `;
}
