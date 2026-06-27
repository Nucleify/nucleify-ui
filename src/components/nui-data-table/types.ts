export interface DataTableColumn {
  field: string;
  header?: string;
  sortable?: boolean;
  class?: string;
}

export type DataTableRow = Record<string, unknown>;

export type DataTableSortOrder = -1 | 0 | 1;

export interface DataTablePageDetail {
  first: number;
  rows: number;
}

export interface DataTableSortDetail {
  sortField: string;
  sortOrder: DataTableSortOrder;
}

export interface DataTableRowClickDetail {
  data: DataTableRow;
  index: number;
}
