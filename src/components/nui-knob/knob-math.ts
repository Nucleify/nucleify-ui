const MATH_PI = Math.PI;
const MIN_RADIANS = (4 * MATH_PI) / 3;
const MAX_RADIANS = -MATH_PI / 3;
const MID = 50;
const RADIUS = 40;

export interface KnobPaths {
  rangePath: string;
  valuePath: string;
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function coordX(radians: number): number {
  return MID + Math.cos(radians) * RADIUS;
}

function coordY(radians: number): number {
  return MID - Math.sin(radians) * RADIUS;
}

function zeroRadians(min: number, max: number): number {
  if (min > 0 && max > 0) {
    return mapRange(min, min, max, MIN_RADIANS, MAX_RADIANS);
  }

  return mapRange(0, min, max, MIN_RADIANS, MAX_RADIANS);
}

function valueRadians(value: number, min: number, max: number): number {
  return mapRange(value, min, max, MIN_RADIANS, MAX_RADIANS);
}

export function getKnobPaths(
  value: number,
  min: number,
  max: number,
): KnobPaths {
  const zero = zeroRadians(min, max);
  const current = valueRadians(value, min, max);
  const largeArc = Math.abs(zero - current) < MATH_PI ? 0 : 1;
  const sweep = current > zero ? 0 : 1;

  return {
    rangePath: `M ${coordX(MIN_RADIANS)} ${coordY(MIN_RADIANS)} A ${RADIUS} ${RADIUS} 0 1 1 ${coordX(MAX_RADIANS)} ${coordY(MAX_RADIANS)}`,
    valuePath: `M ${coordX(zero)} ${coordY(zero)} A ${RADIUS} ${RADIUS} 0 ${largeArc} ${sweep} ${coordX(current)} ${coordY(current)}`,
  };
}

export function clampKnobValue(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(max, Math.max(min, value));
}

export function applyKnobStep(
  value: number,
  step: number,
  min: number,
  max: number,
): number {
  if (step <= 0) {
    return clampKnobValue(Math.round(value), min, max);
  }

  const stepped = min + Math.round((value - min) / step) * step;

  return clampKnobValue(stepped, min, max);
}

export function valueFromOffset(
  offsetX: number,
  offsetY: number,
  size: number,
  min: number,
  max: number,
  step: number,
  options: { snapDeadZone?: boolean } = {},
): number | null {
  const dx = offsetX - size / 2;
  const dy = size / 2 - offsetY;
  const angle = Math.atan2(dy, dx);
  const start = -MATH_PI / 2 - MATH_PI / 6;
  let mappedValue: number;

  if (angle > MAX_RADIANS) {
    mappedValue = mapRange(angle, MIN_RADIANS, MAX_RADIANS, min, max);
  } else if (angle < start) {
    mappedValue = mapRange(
      angle + 2 * MATH_PI,
      MIN_RADIANS,
      MAX_RADIANS,
      min,
      max,
    );
  } else if (options.snapDeadZone) {
    mappedValue = offsetX < size / 2 ? min : max;
  } else {
    return null;
  }

  return applyKnobStep(mappedValue, step, min, max);
}

export function formatKnobValue(value: number, template: string): string {
  return template.replaceAll('{value}', String(value));
}
