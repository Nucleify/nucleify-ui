import type {
  SelectButtonOption,
  SelectButtonPrimitive,
  SelectButtonValue,
} from './types.js';

export function resolveOptionLabel(
  option: SelectButtonOption,
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

export function resolveOptionIcon(
  option: SelectButtonOption,
  optionIcon: string,
): string {
  if (!optionIcon || typeof option !== 'object') {
    return '';
  }

  const icon = option[optionIcon];

  if (icon === undefined || icon === null || icon === '') {
    return '';
  }

  return String(icon);
}

export function resolveOptionValue(
  option: SelectButtonOption,
  optionValue: string,
  optionLabel: string,
): SelectButtonPrimitive {
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
  option: SelectButtonOption,
  optionDisabled: string,
): boolean {
  if (!optionDisabled || typeof option !== 'object') {
    return false;
  }

  return Boolean(option[optionDisabled]);
}

function valuesEqual(
  a: SelectButtonPrimitive,
  b: SelectButtonPrimitive,
): boolean {
  return String(a) === String(b);
}

export function isValueSelected(
  value: SelectButtonValue,
  optionValue: SelectButtonPrimitive,
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
  current: SelectButtonPrimitive[],
  optionValue: SelectButtonPrimitive,
): SelectButtonPrimitive[] {
  const exists = current.some((entry) => valuesEqual(entry, optionValue));

  if (exists) {
    return current.filter((entry) => !valuesEqual(entry, optionValue));
  }

  return [...current, optionValue];
}
