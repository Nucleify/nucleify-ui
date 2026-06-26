import type { ListboxOption, ListboxPrimitive, ListboxValue } from './types.js';

export function resolveOptionLabel(
  option: ListboxOption,
  optionLabel: string,
): string {
  if (typeof option === 'string' || typeof option === 'number') {
    return String(option);
  }

  const label = option[optionLabel];

  if (label === undefined || label === null) {
    return '';
  }

  return String(label);
}

export function resolveOptionValue(
  option: ListboxOption,
  optionValue: string,
  optionLabel: string,
): ListboxPrimitive {
  if (typeof option === 'string' || typeof option === 'number') {
    return option;
  }

  const value = option[optionValue];

  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  return resolveOptionLabel(option, optionLabel);
}

export function isOptionDisabled(
  option: ListboxOption,
  optionDisabled: string,
): boolean {
  if (!optionDisabled || typeof option !== 'object') {
    return false;
  }

  return Boolean(option[optionDisabled]);
}

export function filterOptions(
  options: ListboxOption[],
  query: string,
  optionLabel: string,
): ListboxOption[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return options;
  }

  return options.filter((option) =>
    resolveOptionLabel(option, optionLabel).toLowerCase().includes(normalized),
  );
}

export function valuesEqual(a: ListboxPrimitive, b: ListboxPrimitive): boolean {
  return String(a) === String(b);
}

export function isValueSelected(
  value: ListboxValue,
  optionValue: ListboxPrimitive,
  multiple: boolean,
): boolean {
  if (multiple) {
    return (
      Array.isArray(value) &&
      value.some((entry) => valuesEqual(entry, optionValue))
    );
  }

  if (Array.isArray(value)) {
    return false;
  }

  return (
    value !== null && value !== undefined && valuesEqual(value, optionValue)
  );
}

export function toggleMultipleValue(
  current: ListboxPrimitive[],
  optionValue: ListboxPrimitive,
): ListboxPrimitive[] {
  const exists = current.some((entry) => valuesEqual(entry, optionValue));

  if (exists) {
    return current.filter((entry) => !valuesEqual(entry, optionValue));
  }

  return [...current, optionValue];
}

export function normalizeListboxValue(
  value: ListboxValue,
  multiple: boolean,
): ListboxPrimitive | ListboxPrimitive[] | null {
  if (multiple) {
    return Array.isArray(value) ? value : value === null ? [] : [value];
  }

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}
