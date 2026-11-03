import type { DeepPartial, Preset } from '../types/preset.js';

function isPlainObject(item: unknown): item is Record<string, unknown> {
  return (
    typeof item === 'object' &&
    item !== null &&
    !Array.isArray(item) &&
    !(item instanceof RegExp) &&
    !(item instanceof Date)
  );
}

function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown>,
): T {
  const result: Record<string, unknown> = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) {
      continue;
    }

    const prevValue = result[key];
    if (isPlainObject(prevValue) && isPlainObject(value)) {
      result[key] = deepMerge(prevValue, value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

/**
 * Creates a new preset by extending a base preset with custom overrides.
 *
 * @param base Base preset to inherit from
 * @param overrides Deep partial token and property overrides
 * @returns Fully merged new Preset object
 *
 * @example
 * const myTheme = definePreset(nucleus, {
 *   name: 'custom-nucleus',
 *   semantic: {
 *     primary: emerald,
 *   }
 * });
 */
export function definePreset(
  base: Preset,
  overrides?: DeepPartial<Preset>,
): Preset {
  if (!overrides) {
    return {
      name: base.name,
      tokens: { ...base.tokens },
      css: base.css,
    };
  }

  const mergedTokens = deepMerge(
    base.tokens as unknown as Record<string, unknown>,
    (overrides.tokens ?? overrides) as unknown as Record<string, unknown>,
  );

  return {
    name: overrides.name ?? base.name,
    tokens: mergedTokens as unknown as Preset['tokens'],
    css: overrides.css ?? base.css,
  };
}
