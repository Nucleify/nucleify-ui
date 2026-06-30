import { getCellValue } from './data-table-state.js';
import type {
  DataTableColumn,
  DataTableFilterMatchMode,
  DataTableFilters,
  DataTableRow,
} from './types.js';

export function isColumnFilterable(
  column: DataTableColumn,
  filtersEnabled: boolean,
): boolean {
  if (!filtersEnabled) {
    return false;
  }

  return column.filter !== false;
}

export function getColumnFilterMatchMode(
  column: DataTableColumn,
): DataTableFilterMatchMode {
  if (column.filterMatchMode) {
    return column.filterMatchMode;
  }

  return column.filterType === 'select' ? 'equals' : 'contains';
}

export function getFilterOptionsForColumn(
  rows: DataTableRow[],
  column: DataTableColumn,
): string[] {
  if (column.filterOptions?.length) {
    return column.filterOptions;
  }

  const values = new Set<string>();

  for (const row of rows) {
    const value = getCellValue(row, column.field);

    if (value) {
      values.add(value);
    }
  }

  return [...values].sort((left, right) =>
    left.localeCompare(right, undefined, {
      numeric: true,
      sensitivity: 'base',
    }),
  );
}

export function matchesFilter(
  cellValue: string,
  filterValue: string,
  matchMode: DataTableFilterMatchMode,
): boolean {
  if (!filterValue) {
    return true;
  }

  const value = cellValue.toLowerCase();
  const query = filterValue.toLowerCase();

  switch (matchMode) {
    case 'equals':
      return value === query;
    case 'startsWith':
      return value.startsWith(query);
    case 'endsWith':
      return value.endsWith(query);
    default:
      return value.includes(query);
  }
}

export function rowMatchesFilters(
  row: DataTableRow,
  filters: DataTableFilters,
  columns: DataTableColumn[],
  filtersEnabled: boolean,
): boolean {
  if (!filtersEnabled) {
    return true;
  }

  for (const column of columns) {
    if (!isColumnFilterable(column, filtersEnabled)) {
      continue;
    }

    const filterValue = filters[column.field] ?? '';

    if (!filterValue) {
      continue;
    }

    const cellValue = getCellValue(row, column.field);
    const matchMode = getColumnFilterMatchMode(column);

    if (!matchesFilter(cellValue, filterValue, matchMode)) {
      return false;
    }
  }

  return true;
}

export function filterRows(
  rows: DataTableRow[],
  filters: DataTableFilters,
  columns: DataTableColumn[],
  filtersEnabled: boolean,
): DataTableRow[] {
  if (!filtersEnabled || !hasActiveFilters(filters, columns, filtersEnabled)) {
    return rows;
  }

  return rows.filter((row) =>
    rowMatchesFilters(row, filters, columns, filtersEnabled),
  );
}

export function hasActiveFilters(
  filters: DataTableFilters,
  columns: DataTableColumn[],
  filtersEnabled: boolean,
): boolean {
  if (!filtersEnabled) {
    return false;
  }

  return columns.some(
    (column) =>
      isColumnFilterable(column, filtersEnabled) &&
      Boolean(filters[column.field]?.trim()),
  );
}
