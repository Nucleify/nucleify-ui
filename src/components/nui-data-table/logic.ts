import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import {
  getCellValue,
  getCurrentPage,
  getPageCount,
  paginateRows,
  resolveColumns,
  sortRows,
} from './data-table-state.js';
import type {
  DataTableColumn,
  DataTableRow,
  DataTableSortOrder,
} from './types.js';

export interface NuiDataTableViewState {
  value: DataTableRow[];
  columns: DataTableColumn[];
  dataKey: string;
  rows: number;
  first: number;
  paginator: boolean;
  showHeaders: boolean;
  stripedRows: boolean;
  rowHover: boolean;
  loading: boolean;
  sortField: string;
  sortOrder: DataTableSortOrder;
  emptyMessage: string;
  nuiType: NuiType;
  dataTableClass: string;
}

export interface DataTableRenderHandlers {
  onSort: (field: string) => void;
  onRowClick: (row: DataTableRow, index: number) => void;
  onPageChange: (first: number) => void;
}

export function getDataTableClass(dataTableClass: string): string {
  return ['nui-data-table', dataTableClass].filter(Boolean).join(' ');
}

function renderSortIcon(
  field: string,
  sortField: string,
  sortOrder: DataTableSortOrder,
): TemplateResult | typeof nothing {
  if (field !== sortField || sortOrder === 0) {
    return nothing;
  }

  return html`
    <span class="nui-data-table-sort-icon" aria-hidden="true">
      ${sortOrder === 1 ? '▲' : '▼'}
    </span>
  `;
}

function renderHeader(
  state: NuiDataTableViewState,
  columns: DataTableColumn[],
  handlers: DataTableRenderHandlers,
): TemplateResult {
  return html`
    <thead>
      <tr>
        ${columns.map(
          (column) => html`
            <th
              class=${column.class || nothing}
              scope="col"
              ?sortable=${column.sortable !== false || nothing}
              @click=${() => {
                if (column.sortable !== false) {
                  handlers.onSort(column.field);
                }
              }}
            >
              <span class="nui-data-table-header-content">
                ${column.header || column.field}
                ${renderSortIcon(column.field, state.sortField, state.sortOrder)}
              </span>
            </th>
          `,
        )}
      </tr>
    </thead>
  `;
}

function renderBody(
  state: NuiDataTableViewState,
  columns: DataTableColumn[],
  rows: DataTableRow[],
  handlers: DataTableRenderHandlers,
): TemplateResult {
  if (rows.length === 0) {
    return html`
      <tbody>
        <tr>
          <td class="nui-data-table-empty" colspan=${columns.length}>
            ${state.emptyMessage}
          </td>
        </tr>
      </tbody>
    `;
  }

  return html`
    <tbody>
      ${rows.map((row, index) => {
        const key = getCellValue(row, state.dataKey) || String(index);

        return html`
          <tr
            class="nui-data-table-row"
            data-row-key=${key}
            @click=${() => handlers.onRowClick(row, index)}
          >
            ${columns.map(
              (column) => html`
                <td class=${column.class || nothing}>
                  ${getCellValue(row, column.field)}
                </td>
              `,
            )}
          </tr>
        `;
      })}
    </tbody>
  `;
}

function renderPaginator(
  state: NuiDataTableViewState,
  totalRecords: number,
  handlers: DataTableRenderHandlers,
): TemplateResult {
  const pageCount = getPageCount(totalRecords, state.rows);
  const currentPage = getCurrentPage(state.first, state.rows);
  const atStart = state.first <= 0;
  const atEnd = state.first + state.rows >= totalRecords;

  return html`
    <div class="nui-data-table-paginator">
      <div class="nui-data-table-paginator-content">
        <button
          type="button"
          class="nui-data-table-paginator-button"
          ?disabled=${atStart}
          @click=${() => handlers.onPageChange(0)}
        >
          «
        </button>
        <button
          type="button"
          class="nui-data-table-paginator-button"
          ?disabled=${atStart}
          @click=${() =>
            handlers.onPageChange(Math.max(0, state.first - state.rows))}
        >
          ‹
        </button>
        <span class="nui-data-table-paginator-current">
          ${currentPage} / ${pageCount}
        </span>
        <button
          type="button"
          class="nui-data-table-paginator-button"
          ?disabled=${atEnd}
          @click=${() => handlers.onPageChange(state.first + state.rows)}
        >
          ›
        </button>
        <button
          type="button"
          class="nui-data-table-paginator-button"
          ?disabled=${atEnd}
          @click=${() => handlers.onPageChange((pageCount - 1) * state.rows)}
        >
          »
        </button>
      </div>
    </div>
  `;
}

export function renderDataTable(
  state: NuiDataTableViewState,
  handlers: DataTableRenderHandlers,
): TemplateResult {
  if (state.loading) {
    return html`
      <div
        class=${getDataTableClass(state.dataTableClass)}
        nui-type=${state.nuiType || nothing}
        ?loading=${true}
      >
        <div class="nui-data-table-loading">Loading...</div>
      </div>
    `;
  }

  if (!state.value || state.value.length === 0) {
    return html`
      <div
        class=${getDataTableClass(state.dataTableClass)}
        nui-type=${state.nuiType || nothing}
      >
        <div class="nui-data-table-empty-state">${state.emptyMessage}</div>
      </div>
    `;
  }

  const columns = resolveColumns(state.value, state.columns);
  const sortedRows = sortRows(state.value, state.sortField, state.sortOrder);
  const visibleRows = state.paginator
    ? paginateRows(sortedRows, state.first, state.rows)
    : sortedRows;

  return html`
    <div
      class=${getDataTableClass(state.dataTableClass)}
      nui-type=${state.nuiType || nothing}
      ?striped-rows=${state.stripedRows || nothing}
      ?row-hover=${state.rowHover || nothing}
    >
      <div class="nui-data-table-wrapper">
        <table class="nui-data-table-table">
          ${state.showHeaders ? renderHeader(state, columns, handlers) : nothing}
          ${renderBody(state, columns, visibleRows, handlers)}
        </table>
      </div>
      ${
        state.paginator
          ? renderPaginator(state, sortedRows.length, handlers)
          : nothing
      }
    </div>
  `;
}
