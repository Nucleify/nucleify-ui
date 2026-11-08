import type { CalendarDay } from './types.js';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function parseIsoDate(value: string): Date | null {
  if (!ISO_DATE_PATTERN.test(value)) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function formatDisplayDate(value: string, dateFormat: string): string {
  const date = parseIsoDate(value);

  if (!date) {
    return value;
  }

  if (dateFormat === 'yy-mm-dd') {
    return toIsoDate(date);
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function isSameDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function buildCalendarDays(visibleMonth: Date): CalendarDay[] {
  const monthStart = startOfMonth(visibleMonth);
  const gridStart = new Date(monthStart);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const days: CalendarDay[] = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    days.push({
      date,
      inMonth: date.getMonth() === visibleMonth.getMonth(),
      iso: toIsoDate(date),
    });
  }

  return days;
}

export function getMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function getMonthName(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'long',
  }).format(date);
}

export function getShortMonthLabels(): string[] {
  const formatter = new Intl.DateTimeFormat(undefined, { month: 'short' });

  return Array.from({ length: 12 }, (_, month) =>
    formatter.format(new Date(2024, month, 1)),
  );
}

export function getDecadeRange(year: number): {
  start: number;
  end: number;
  years: number[];
} {
  const start = Math.floor(year / 10) * 10;
  const end = start + 9;
  const years = Array.from({ length: 10 }, (_, index) => start + index);

  return { start, end, years };
}

export function getWeekdayLabels(): string[] {
  const formatter = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
  const base = new Date(2024, 0, 7);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(base);
    date.setDate(base.getDate() + index);
    return formatter.format(date);
  });
}

export function normalizeManualInput(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  if (ISO_DATE_PATTERN.test(trimmed)) {
    return parseIsoDate(trimmed) ? trimmed : '';
  }

  const parsed = parseIsoDate(trimmed.replace(/\./g, '-').replace(/\//g, '-'));

  return parsed ? toIsoDate(parsed) : '';
}
