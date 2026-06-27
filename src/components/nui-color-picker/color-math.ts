import type { ColorFormat, ColorHsb, ColorRgb, ColorValue } from './types.js';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeHex(value: string): string {
  const hex = value.replace(/^#/, '').trim().toLowerCase();

  if (!hex) {
    return '000000';
  }

  if (hex.length === 3) {
    return hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  return hex.slice(0, 6).padEnd(6, '0');
}

export function hexToRgb(hex: string): ColorRgb {
  const normalized = normalizeHex(hex);
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function rgbToHex(rgb: ColorRgb): string {
  const channel = (value: number) =>
    clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0');

  return `${channel(rgb.r)}${channel(rgb.g)}${channel(rgb.b)}`;
}

export function rgbToHsb(rgb: ColorRgb): ColorHsb {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;

  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }

    h *= 60;

    if (h < 0) {
      h += 360;
    }
  }

  const s = max === 0 ? 0 : (delta / max) * 100;

  return { h, s, b: max * 100 };
}

export function hsbToRgb(hsb: ColorHsb): ColorRgb {
  const h = ((hsb.h % 360) + 360) % 360;
  const s = clamp(hsb.s, 0, 100) / 100;
  const v = clamp(hsb.b, 0, 100) / 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let rp = 0;
  let gp = 0;
  let bp = 0;

  if (h < 60) {
    rp = c;
    gp = x;
  } else if (h < 120) {
    rp = x;
    gp = c;
  } else if (h < 180) {
    gp = c;
    bp = x;
  } else if (h < 240) {
    gp = x;
    bp = c;
  } else if (h < 300) {
    rp = x;
    bp = c;
  } else {
    rp = c;
    bp = x;
  }

  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  };
}

export function normalizeHsb(hsb: ColorHsb): ColorHsb {
  return {
    h: clamp(hsb.h, 0, 360),
    s: clamp(hsb.s, 0, 100),
    b: clamp(hsb.b, 0, 100),
  };
}

export function formatColorValue(
  hsb: ColorHsb,
  format: ColorFormat,
): string | ColorRgb | ColorHsb {
  const normalized = normalizeHsb(hsb);
  const rgb = hsbToRgb(normalized);

  switch (format) {
    case 'hex':
      return rgbToHex(rgb);
    case 'rgb':
      return rgb;
    case 'hsb':
      return {
        h: Math.round(normalized.h),
        s: Math.round(normalized.s),
        b: Math.round(normalized.b),
      };
  }
}

export function parseColorValue(
  value: ColorValue | null | undefined,
  format: ColorFormat,
  defaultColor: string,
): ColorHsb {
  if (value === null || value === undefined || value === '') {
    return rgbToHsb(hexToRgb(defaultColor));
  }

  if (format === 'hex' && typeof value === 'string') {
    return rgbToHsb(hexToRgb(value));
  }

  if (format === 'rgb' && typeof value === 'object' && 'r' in value) {
    return rgbToHsb(value);
  }

  if (format === 'hsb' && typeof value === 'object' && 'h' in value) {
    return normalizeHsb(value);
  }

  if (typeof value === 'string') {
    return rgbToHsb(hexToRgb(value));
  }

  if (typeof value === 'object' && 'r' in value) {
    return rgbToHsb(value);
  }

  if (typeof value === 'object' && 'h' in value) {
    return normalizeHsb(value);
  }

  return rgbToHsb(hexToRgb(defaultColor));
}

export function hsbToCssColor(hsb: ColorHsb): string {
  const rgb = hsbToRgb(normalizeHsb(hsb));
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function valuesEqual(
  left: ColorValue | null | undefined,
  right: ColorValue,
  format: ColorFormat,
): boolean {
  if (
    format === 'hex' &&
    typeof left === 'string' &&
    typeof right === 'string'
  ) {
    return normalizeHex(left) === normalizeHex(right);
  }

  return JSON.stringify(left) === JSON.stringify(right);
}
