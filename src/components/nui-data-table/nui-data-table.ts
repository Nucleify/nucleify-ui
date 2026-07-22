import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../nui-input-text/nui-input-text.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { NuiSelect } from '../nui-select/nui-select.js';
import { toggleSortOrder } from './data-table-state.js';
import { type NuiDataTableViewState, renderDataTable } from './logic.js';
import type {
  DataTableColumn,
  DataTableFilters,
  DataTableRow,
  DataTableSize,
  DataTableSortOrder,
} from './types.js';

const styles = createComponentStyles(
  'nui-data-table',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-data-table')
export class NuiDataTable extends LitElement implements NuiDataTableViewState {
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  value: DataTableRow[] = [];
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  columns: DataTableColumn[] = [];
  @property({ type: String, attribute: 'data-key' }) dataKey = 'id';
  @property({ type: Number }) rows = 10;
  @property({ type: Number }) first = 0;
  @property({ type: Boolean, reflect: true }) paginator = false;
  @property({ type: Boolean, reflect: true }) filter = false;
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  filters: DataTableFilters = {};
  @property({ type: Boolean, attribute: 'show-headers', reflect: true })
  showHeaders = true;
  @property({ type: Boolean, attribute: 'striped-rows', reflect: true })
  stripedRows = true;
  @property({ type: Boolean, attribute: 'row-hover', reflect: true })
  rowHover = true;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: String, attribute: 'sort-field' }) sortField = '';
  @property({ type: Number, attribute: 'sort-order' })
  sortOrder: DataTableSortOrder = 0;
  @property({ type: String, attribute: 'empty-message' }) emptyMessage =
    'No records found';
  @property({ type: String, reflect: true }) size: DataTableSize = 'medium';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'data-table-class' })
  dataTableClass = '';

  protected createRenderRoot() {
    const root = super.createRenderRoot();
    void styles.sync(root, { unstyled: this.unstyled });
    return root;
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('value') && this.paginator) {
      const maxFirst = Math.max(0, this.value.length - this.rows);

      if (this.first > maxFirst) {
        this.first = maxFirst;
      }
    }
  }

  private handleSort = (field: string): void => {
    const nextOrder = toggleSortOrder(this.sortField, this.sortOrder, field);
    this.sortField = nextOrder === 0 ? '' : field;
    this.sortOrder = nextOrder;
    this.first = 0;

    this.dispatchEvent(
      new CustomEvent('sort', {
        detail: { sortField: this.sortField, sortOrder: this.sortOrder },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private handleRowClick = (row: DataTableRow, index: number): void => {
    this.dispatchEvent(
      new CustomEvent('row-click', {
        detail: { data: row, index },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private handlePageChange = (first: number): void => {
    this.first = Math.max(0, first);

    this.dispatchEvent(
      new CustomEvent('page', {
        detail: { first: this.first, rows: this.rows },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private handleFilterChange = (field: string, value: string): void => {
    this.filters = {
      ...this.filters,
      [field]: value,
    };
    this.first = 0;

    this.dispatchEvent(
      new CustomEvent('filter', {
        detail: { filters: this.filters },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private handleFilterSelectOpen = (event: Event): void => {
    const source = event.target;

    if (!(source instanceof NuiSelect)) {
      return;
    }

    this.renderRoot.querySelectorAll('nui-select').forEach((select) => {
      if (select !== source) {
        (select as NuiSelect).open = false;
      }
    });
  };

  render() {
    return renderDataTable(this, {
      onSort: this.handleSort,
      onRowClick: this.handleRowClick,
      onPageChange: this.handlePageChange,
      onFilterChange: this.handleFilterChange,
      onFilterSelectOpen: this.handleFilterSelectOpen,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-data-table': NuiDataTable;
  }
}
