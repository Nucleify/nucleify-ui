export type DataTableFilterMatchMode =
  | 'contains'
  | 'equals'
  | 'startsWith'
  | 'endsWith';

export type DataTableFilterType = 'text' | 'select';

export interface DataTableColumn {
  field: string;
  header?: string;
  sortable?: boolean;
  filter?: boolean;
  filterType?: DataTableFilterType;
  filterMatchMode?: DataTableFilterMatchMode;
  filterOptions?: string[];
  class?: string;
}

export type DataTableRow = Record<string, unknown>;

export type DataTableFilters = Record<string, string>;

export type DataTableSortOrder = -1 | 0 | 1;

export type DataTableSize = 'small' | 'medium' | 'large';

export interface DataTablePageDetail {
  first: number;
  rows: number;
}

export interface DataTableSortDetail {
  sortField: string;
  sortOrder: DataTableSortOrder;
}

export interface DataTableFilterDetail {
  filters: DataTableFilters;
}

export interface DataTableRowClickDetail {
  data: DataTableRow;
  index: number;
}
