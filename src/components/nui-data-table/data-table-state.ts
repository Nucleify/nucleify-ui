import type {
  DataTableColumn,
  DataTableRow,
  DataTableSortOrder,
} from './types.js';

export function capitalizeField(field: string): string {
  if (!field) {
    return '';
  }

  return field.charAt(0).toUpperCase() + field.slice(1);
}

export function resolveColumns(
  value: DataTableRow[],
  columns: DataTableColumn[],
): DataTableColumn[] {
  if (columns.length > 0) {
    return columns;
  }

  if (value.length === 0) {
    return [];
  }

  return Object.keys(value[0]).map((field) => ({
    field,
    header: capitalizeField(field),
    sortable: true,
  }));
}

export function getCellValue(row: DataTableRow, field: string): string {
  const cell = row[field];

  if (cell === null || cell === undefined) {
    return '';
  }

  return String(cell);
}

export function sortRows(
  rows: DataTableRow[],
  sortField: string,
  sortOrder: DataTableSortOrder,
): DataTableRow[] {
  if (!sortField || sortOrder === 0) {
    return rows;
  }

  const sorted = [...rows];

  sorted.sort((left, right) => {
    const leftValue = getCellValue(left, sortField);
    const rightValue = getCellValue(right, sortField);
    const leftNumber = Number(leftValue);
    const rightNumber = Number(rightValue);
    const bothNumeric =
      leftValue !== '' &&
      rightValue !== '' &&
      !Number.isNaN(leftNumber) &&
      !Number.isNaN(rightNumber);

    let result = 0;

    if (bothNumeric) {
      result = leftNumber - rightNumber;
    } else {
      result = leftValue.localeCompare(rightValue, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    }

    return sortOrder === -1 ? -result : result;
  });

  return sorted;
}

export function paginateRows(
  rows: DataTableRow[],
  first: number,
  rowsPerPage: number,
): DataTableRow[] {
  if (rowsPerPage <= 0) {
    return rows;
  }

  return rows.slice(first, first + rowsPerPage);
}

export function getPageCount(
  totalRecords: number,
  rowsPerPage: number,
): number {
  if (rowsPerPage <= 0 || totalRecords === 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(totalRecords / rowsPerPage));
}

export function getCurrentPage(first: number, rowsPerPage: number): number {
  if (rowsPerPage <= 0) {
    return 1;
  }

  return Math.floor(first / rowsPerPage) + 1;
}

export function toggleSortOrder(
  currentField: string,
  currentOrder: DataTableSortOrder,
  nextField: string,
): DataTableSortOrder {
  if (currentField !== nextField) {
    return 1;
  }

  if (currentOrder === 1) {
    return -1;
  }

  if (currentOrder === -1) {
    return 0;
  }

  return 1;
}
