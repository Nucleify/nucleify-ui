import type { InputNumberMode } from './types.js';

export interface NumberFormatConfig {
  format: boolean;
  mode: InputNumberMode;
  locale: string;
  currency: string;
  useGrouping: boolean;
  minFractionDigits?: number;
  maxFractionDigits?: number;
  prefix: string;
  suffix: string;
}

export function clampNumber(
  value: number,
  min: number | null,
  max: number | null,
): number {
  let next = value;

  if (min !== null && next < min) {
    next = min;
  }

  if (max !== null && next > max) {
    next = max;
  }

  return next;
}

export function formatNumber(
  value: number | null,
  config: NumberFormatConfig,
): string {
  if (value === null || Number.isNaN(value)) {
    return '';
  }

  if (!config.format) {
    return String(value);
  }

  const formatter = new Intl.NumberFormat(config.locale || undefined, {
    style: config.mode,
    currency: config.mode === 'currency' ? config.currency || 'USD' : undefined,
    useGrouping: config.useGrouping,
    minimumFractionDigits: config.minFractionDigits,
    maximumFractionDigits: config.maxFractionDigits,
  });

  let formatted = formatter.format(value);

  if (config.prefix) {
    formatted = `${config.prefix}${formatted}`;
  }

  if (config.suffix) {
    formatted = `${formatted}${config.suffix}`;
  }

  return formatted;
}

export function parseNumber(
  text: string,
  config: NumberFormatConfig,
): number | null {
  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  let source = trimmed;

  if (config.prefix && source.startsWith(config.prefix)) {
    source = source.slice(config.prefix.length);
  }

  if (config.suffix && source.endsWith(config.suffix)) {
    source = source.slice(0, -config.suffix.length);
  }

  source = source.trim();

  if (!config.format) {
    const parsed = Number(source);

    return Number.isFinite(parsed) ? parsed : null;
  }

  const locale = config.locale || undefined;
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const group = parts.find((part) => part.type === 'group')?.value ?? ',';
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.';
  const minus = parts.find((part) => part.type === 'minusSign')?.value ?? '-';
  const normalized = source
    .replaceAll(group, '')
    .replace(decimal, '.')
    .replaceAll(minus, '-')
    .replace(/[^\d.-]/g, '');
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

export function stepNumber(
  value: number | null,
  step: number,
  direction: 1 | -1,
  min: number | null,
  max: number | null,
): number | null {
  const base = value ?? 0;
  const next = base + step * direction;

  return clampNumber(next, min, max);
}
