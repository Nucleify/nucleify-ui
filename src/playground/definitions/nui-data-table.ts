import { html, type TemplateResult } from 'lit';
import type {
  DataTableColumn,
  DataTableRow,
} from '../../components/nui-data-table/types.js';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundPreviewHandlers,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const DEFAULT_VALUE: DataTableRow[] = [
  { id: 1, name: 'Nucleify', status: 'Active', category: 'Platform' },
  { id: 2, name: 'Page Builder', status: 'Active', category: 'Module' },
  { id: 3, name: 'Auth', status: 'Active', category: 'Module' },
];

const ATTRIBUTE_NAMES: Record<string, string> = {
  dataKey: 'data-key',
  showHeaders: 'show-headers',
  stripedRows: 'striped-rows',
  rowHover: 'row-hover',
  sortField: 'sort-field',
  sortOrder: 'sort-order',
  emptyMessage: 'empty-message',
  dataTableClass: 'data-table-class',
  nuiType: 'nui-type',
};

export const NUI_DATA_TABLE_DEFAULTS: PlaygroundProps = {
  value: JSON.stringify(DEFAULT_VALUE, null, 2),
  columns: '',
  dataKey: 'id',
  rows: '10',
  first: '0',
  paginator: false,
  showHeaders: true,
  stripedRows: true,
  rowHover: true,
  loading: false,
  sortField: '',
  sortOrder: '0',
  emptyMessage: 'No records found',
  unstyled: false,
  nuiType: '',
  dataTableClass: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'value',
    label: 'value (JSON)',
    type: 'textarea',
    section: 'Content',
    rows: 10,
    fullWidth: true,
    placeholder: '[{"id":1,"name":"Nucleify"}]',
  },
  {
    key: 'columns',
    label: 'columns (JSON)',
    type: 'textarea',
    section: 'Content',
    rows: 6,
    fullWidth: true,
    placeholder: '[{"field":"name","header":"Name","sortable":true}]',
  },
  {
    key: 'emptyMessage',
    label: 'empty-message',
    type: 'text',
    section: 'Content',
    placeholder: 'No records found',
  },
  {
    key: 'dataTableClass',
    label: 'data-table-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'showHeaders',
    label: 'show-headers',
    type: 'boolean',
    section: 'Appearance',
  },
  {
    key: 'stripedRows',
    label: 'striped-rows',
    type: 'boolean',
    section: 'Appearance',
  },
  {
    key: 'rowHover',
    label: 'row-hover',
    type: 'boolean',
    section: 'Appearance',
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'paginator',
    label: 'paginator',
    type: 'boolean',
    section: 'Layout',
  },
  {
    key: 'rows',
    label: 'rows',
    type: 'text',
    section: 'Layout',
    placeholder: '10',
  },
  {
    key: 'first',
    label: 'first',
    type: 'text',
    section: 'Layout',
    placeholder: '0',
  },
  {
    key: 'sortField',
    label: 'sort-field',
    type: 'text',
    section: 'Layout',
  },
  {
    key: 'sortOrder',
    label: 'sort-order',
    type: 'select',
    section: 'Layout',
    options: [
      { value: '0', label: '0 (none)' },
      { value: '1', label: '1 (asc)' },
      { value: '-1', label: '-1 (desc)' },
    ],
  },
  {
    key: 'dataKey',
    label: 'data-key',
    type: 'text',
    section: 'HTML',
    placeholder: 'id',
  },
  {
    key: 'loading',
    label: 'loading',
    type: 'boolean',
    section: 'State',
  },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
];

function parseJsonArray<T>(value: unknown, fallback: T[]): T[] {
  if (typeof value !== 'string' || !value.trim()) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function parseColumns(value: unknown): DataTableColumn[] {
  if (typeof value !== 'string' || !value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? (parsed as DataTableColumn[]) : [];
  } catch {
    return [];
  }
}

function handleSort(event: Event, handlers?: PlaygroundPreviewHandlers): void {
  if (!handlers) {
    return;
  }

  const detail = (
    event as CustomEvent<{ sortField: string; sortOrder: number }>
  ).detail;

  handlers.onPropChange('sortField', detail.sortField);
  handlers.onPropChange('sortOrder', String(detail.sortOrder));
  handlers.onPropChange('first', '0');
}

function handlePage(event: Event, handlers?: PlaygroundPreviewHandlers): void {
  if (!handlers) {
    return;
  }

  const detail = (event as CustomEvent<{ first: number }>).detail;
  handlers.onPropChange('first', String(detail.first));
}

function renderPreview(
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  return html`
    <div class="data-table-preview">
      <nui-data-table
        .value=${parseJsonArray<DataTableRow>(props.value, DEFAULT_VALUE)}
        .columns=${parseColumns(props.columns)}
        data-key=${whenString(props.dataKey)}
        rows=${Number(props.rows)}
        first=${Number(props.first)}
        sort-field=${whenString(props.sortField)}
        sort-order=${Number(props.sortOrder) as -1 | 0 | 1}
        empty-message=${whenString(props.emptyMessage)}
        data-table-class=${whenString(props.dataTableClass)}
        nui-type=${whenString(props.nuiType)}
        ?paginator=${whenBoolean(props.paginator)}
        ?show-headers=${whenBoolean(props.showHeaders)}
        ?striped-rows=${whenBoolean(props.stripedRows)}
        ?row-hover=${whenBoolean(props.rowHover)}
        ?loading=${whenBoolean(props.loading)}
        ?unstyled=${whenBoolean(props.unstyled)}
        @sort=${(event: Event) => handleSort(event, handlers)}
        @page=${(event: Event) => handlePage(event, handlers)}
      ></nui-data-table>
    </div>
  `;
}

export const nuiDataTablePlayground: PlaygroundDefinition = {
  tag: 'nui-data-table',
  label: 'Data Table',
  description:
    'Tabular data with auto columns, sorting, pagination, striped rows, and row hover.',
  defaults: NUI_DATA_TABLE_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  getPreviewClass: () => 'is-fluid',
  formatUsage: (props) => {
    const { value: _value, columns: _columns, ...usageProps } = props;

    return formatUsageFromDefaults(
      'nui-data-table',
      usageProps,
      NUI_DATA_TABLE_DEFAULTS,
      ATTRIBUTE_NAMES,
    );
  },
};
