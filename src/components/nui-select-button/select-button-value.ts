import {
  isValueSelected,
  toggleMultipleValue,
} from './select-button-options.js';
import type { SelectButtonPrimitive, SelectButtonValue } from './types.js';

export type SelectButtonValueResult =
  | { changed: false }
  | { changed: true; value: SelectButtonValue };

function normalizeMultipleValue(
  value: SelectButtonValue,
): SelectButtonPrimitive[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === null || value === undefined) {
    return [];
  }

  return [value];
}

export function computeNextSelectButtonValue(
  current: SelectButtonValue,
  optionValue: SelectButtonPrimitive,
  multiple: boolean,
  allowEmpty: boolean,
): SelectButtonValueResult {
  const selected = isValueSelected(current, optionValue, multiple);

  if (multiple) {
    const normalized = normalizeMultipleValue(current);
    const next = toggleMultipleValue(normalized, optionValue);

    if (!allowEmpty && next.length === 0) {
      return { changed: false };
    }

    return { changed: true, value: next };
  }

  if (selected) {
    if (!allowEmpty) {
      return { changed: false };
    }

    return { changed: true, value: null };
  }

  return { changed: true, value: optionValue };
}
