import type { AccordionPanelValue, AccordionValue } from './types.js';

function valuesEqual(a: AccordionPanelValue, b: AccordionPanelValue): boolean {
  return String(a) === String(b);
}

export function isPanelOpen(
  value: AccordionValue,
  panelValue: AccordionPanelValue,
  multiple: boolean,
): boolean {
  if (multiple) {
    return (
      Array.isArray(value) &&
      value.some((entry) => valuesEqual(entry, panelValue))
    );
  }

  if (Array.isArray(value)) {
    return false;
  }

  return value !== null && valuesEqual(value, panelValue);
}

export function toggleAccordionValue(
  current: AccordionValue,
  panelValue: AccordionPanelValue,
  multiple: boolean,
): AccordionValue {
  if (multiple) {
    const normalized = Array.isArray(current)
      ? [...current]
      : current === null
        ? []
        : [current];

    const exists = normalized.some((entry) => valuesEqual(entry, panelValue));

    return exists
      ? normalized.filter((entry) => !valuesEqual(entry, panelValue))
      : [...normalized, panelValue];
  }

  const isOpen =
    current !== null &&
    !Array.isArray(current) &&
    valuesEqual(current, panelValue);

  return isOpen ? null : panelValue;
}

export function normalizeAccordionPlaygroundValue(
  value: unknown,
  multiple: boolean,
): AccordionValue {
  if (multiple) {
    if (typeof value !== 'string' || !value.trim()) {
      return [];
    }

    try {
      const parsed = JSON.parse(value) as unknown;

      return Array.isArray(parsed) ? (parsed as AccordionPanelValue[]) : [];
    } catch {
      return [];
    }
  }

  if (value === undefined || value === null || value === '') {
    return null;
  }

  const asNumber = Number(value);

  return Number.isFinite(asNumber) && String(asNumber) === String(value)
    ? asNumber
    : String(value);
}
