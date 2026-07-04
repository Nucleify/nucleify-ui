import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { auditComponentTypes } from '../scripts/audit-component-types.mjs';

const requireFromRoot = createRequire(
  path.resolve(process.cwd(), 'package.json'),
);

import { readFile } from 'node:fs/promises';

async function readDeclaration(componentName: string): Promise<string> {
  const filePath = path.resolve(
    process.cwd(),
    `dist/components/${componentName}/${componentName}.d.ts`,
  );

  return readFile(filePath, 'utf8');
}

async function readTypesDeclaration(componentName: string): Promise<string> {
  const filePath = path.resolve(
    process.cwd(),
    `dist/components/${componentName}/types.d.ts`,
  );

  return readFile(filePath, 'utf8');
}

describe('component declarations', () => {
  it('passes the component types audit', async () => {
    const result = await auditComponentTypes(process.cwd());

    expect(result.issueCount).toBe(0);
    expect(result.summary.total).toBe(54);
    expect(result.summary.withCustomEvents).toBe(32);
    expect(result.summary.withManualEventMap).toBe(32);
  });

  it('resolves public type subpaths from package exports', () => {
    const subpaths = [
      'nucleify-ui/components/nui-button/types',
      'nucleify-ui/components/nui-dialog/types',
      'nucleify-ui/types/component-events',
      'nucleify-ui/types/nui-type',
    ];

    for (const subpath of subpaths) {
      expect(requireFromRoot.resolve(subpath)).toContain('/dist/');
    }
  });

  it('nui-button exposes typed public properties', async () => {
    const content = await readDeclaration('nui-button');

    expect(content).toContain('export declare class NuiButton');
    expect(content).toContain('label: string');
    expect(content).toContain('variant: ButtonVariant');
    expect(content).toContain('severity: ButtonSeverity');
    expect(content).not.toMatch(
      /declare class NuiButton extends LitElement \{\}/,
    );
  });

  it('nui-button documents slots and custom events', async () => {
    const content = await readDeclaration('nui-button');

    expect(content).toContain('@slot - Default slot content');
    expect(content).not.toContain('NuiButtonEventMap');
  });

  it('nui-dialog documents slots and typed custom events', async () => {
    const component = await readDeclaration('nui-dialog');
    const types = await readTypesDeclaration('nui-dialog');

    expect(component).toContain('@slot header');
    expect(component).toContain('@slot - Default slot content');
    expect(component).toContain('@slot footer');
    expect(component).toContain('export type { NuiDialogEventMap }');
    expect(component).toContain(
      'addEventListener<K extends keyof NuiDialogEventMap>',
    );

    expect(types).toContain('export interface NuiDialogEventMap');
    expect(types).toContain('hide: CustomEvent<OriginalEventDetail>');
    expect(types).toContain('change: CustomEvent<VisibleChangeEventDetail>');
  });

  it('nui-input-text exposes typed value event details', async () => {
    const types = await readTypesDeclaration('nui-input-text');

    expect(types).toContain('export interface NuiInputTextEventMap');
    expect(types).toContain('input: CustomEvent<ValueEventDetail>');
    expect(types).toContain('change: CustomEvent<ValueEventDetail>');
  });

  it('nui-file-upload exposes typed custom event details', async () => {
    const component = await readDeclaration('nui-file-upload');
    const types = await readTypesDeclaration('nui-file-upload');

    expect(component).toContain('export type { NuiFileUploadEventMap }');
    expect(component).toContain(
      'addEventListener<K extends keyof NuiFileUploadEventMap>',
    );

    expect(types).toContain('export interface NuiFileUploadEventMap');
    expect(types).toContain(
      "'before-upload': CustomEvent<FileUploadBeforeUploadDetail>",
    );
    expect(types).toContain('select: CustomEvent<FileUploadSelectDetail>');
    expect(types).toContain('error: CustomEvent<FileUploadErrorDetail>');
  });

  it('nui-data-table reuses existing table event detail types', async () => {
    const types = await readTypesDeclaration('nui-data-table');

    expect(types).toContain('sort: CustomEvent<DataTableSortDetail>');
    expect(types).toContain(
      "'row-click': CustomEvent<DataTableRowClickDetail>",
    );
    expect(types).toContain('page: CustomEvent<DataTablePageDetail>');
    expect(types).toContain('filter: CustomEvent<DataTableFilterDetail>');
  });
});
