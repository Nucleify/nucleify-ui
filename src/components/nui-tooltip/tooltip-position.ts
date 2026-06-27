import type { TooltipPosition } from './types.js';

const GAP = 8;

export interface TooltipCoords {
  top: number;
  left: number;
  side: TooltipPosition;
}

function getCoordsForSide(
  trigger: DOMRect,
  tooltip: DOMRect,
  side: TooltipPosition,
): Pick<TooltipCoords, 'top' | 'left'> {
  switch (side) {
    case 'top':
      return {
        top: trigger.top - tooltip.height - GAP,
        left: trigger.left + trigger.width / 2 - tooltip.width / 2,
      };
    case 'bottom':
      return {
        top: trigger.bottom + GAP,
        left: trigger.left + trigger.width / 2 - tooltip.width / 2,
      };
    case 'left':
      return {
        top: trigger.top + trigger.height / 2 - tooltip.height / 2,
        left: trigger.left - tooltip.width - GAP,
      };
    default:
      return {
        top: trigger.top + trigger.height / 2 - tooltip.height / 2,
        left: trigger.right + GAP,
      };
  }
}

function fitsInViewport(
  coords: Pick<TooltipCoords, 'top' | 'left'>,
  tooltip: DOMRect,
): boolean {
  const margin = 4;

  return (
    coords.top >= margin &&
    coords.left >= margin &&
    coords.top + tooltip.height <= window.innerHeight - margin &&
    coords.left + tooltip.width <= window.innerWidth - margin
  );
}

function uniquePositions(preferred: TooltipPosition): TooltipPosition[] {
  const order: TooltipPosition[] = ['right', 'left', 'top', 'bottom'];
  const rest = order.filter((side) => side !== preferred);

  return [preferred, ...rest];
}

export function computeTooltipPosition(
  trigger: DOMRect,
  tooltip: DOMRect,
  preferred: TooltipPosition,
  fitContent: boolean,
): TooltipCoords {
  const sides = fitContent ? uniquePositions(preferred) : [preferred];

  for (const side of sides) {
    const coords = getCoordsForSide(trigger, tooltip, side);

    if (!fitContent || fitsInViewport(coords, tooltip)) {
      return { ...coords, side };
    }
  }

  return {
    ...getCoordsForSide(trigger, tooltip, preferred),
    side: preferred,
  };
}
