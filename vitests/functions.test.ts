import { describe, expect, it } from 'vitest';
import {
  clampNumber,
  parseNumber,
} from '../src/components/nui-input-number/number-format.js';
import {
  formatSecondaryCount,
  formatTileCount,
} from '../src/components/nui-tile/tile-format.js';

describe('format helpers', () => {
  it('formatTileCount handles empty values', () => {
    expect(formatTileCount('')).toBe('');
    expect(formatTileCount(undefined)).toBe('');
    expect(formatTileCount(12)).toBe('12');
  });

  it('formatSecondaryCount handles non-numbers', () => {
    expect(formatSecondaryCount('')).toBe('');
    expect(formatSecondaryCount('abc')).toBe('0 new');
    expect(formatSecondaryCount(5)).toBe('5 new');
  });

  it('clampNumber clamps to min/max', () => {
    expect(clampNumber(5, 10, 20)).toBe(10);
    expect(clampNumber(30, 10, 20)).toBe(20);
    expect(clampNumber(15, 10, 20)).toBe(15);
  });

  it('parseNumber parses unformatted text', () => {
    const config = {
      format: false,
      mode: 'decimal',
      locale: '',
      currency: '',
      useGrouping: false,
      prefix: '',
      suffix: '',
    } as const;
    expect(parseNumber(' 12 ', config)).toBe(12);
    expect(parseNumber('abc', config)).toBe(null);
  });
});
