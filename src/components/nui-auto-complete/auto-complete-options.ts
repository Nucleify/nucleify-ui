import type { AutoCompletePrimitive, AutoCompleteSuggestion } from './types.js';

export function resolveOptionLabel(
  option: AutoCompleteSuggestion,
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
  option: AutoCompleteSuggestion,
  optionValue: string,
  optionLabel: string,
): AutoCompletePrimitive {
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
  option: AutoCompleteSuggestion,
  optionDisabled: string,
): boolean {
  if (!optionDisabled || typeof option !== 'object') {
    return false;
  }

  return Boolean(option[optionDisabled]);
}

export function filterSuggestions(
  suggestions: AutoCompleteSuggestion[],
  query: string,
  optionLabel: string,
): AutoCompleteSuggestion[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return suggestions;
  }

  return suggestions.filter((option) =>
    resolveOptionLabel(option, optionLabel).toLowerCase().includes(normalized),
  );
}

export function resolveDisplayText(
  value: string,
  suggestions: AutoCompleteSuggestion[],
  optionLabel: string,
  optionValue: string,
): string {
  if (!value) {
    return '';
  }

  const match = suggestions.find(
    (option) =>
      String(resolveOptionValue(option, optionValue, optionLabel)) === value,
  );

  if (match) {
    return resolveOptionLabel(match, optionLabel);
  }

  return value;
}

export function findSuggestionByLabel(
  suggestions: AutoCompleteSuggestion[],
  query: string,
  optionLabel: string,
): AutoCompleteSuggestion | undefined {
  const normalized = query.trim().toLowerCase();

  return suggestions.find(
    (option) =>
      resolveOptionLabel(option, optionLabel).toLowerCase() === normalized,
  );
}
