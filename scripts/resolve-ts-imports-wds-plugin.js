import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Rewrites relative `.js` imports to `.ts` when the TypeScript source exists.
 * Needed because tsc expects `.js` extensions in imports, but source files are `.ts`.
 */
export function resolveTsImportsPlugin(rootDir) {
  return {
    name: 'resolve-ts-imports',

    async transformImport({ source, context }) {
      if (!source.startsWith('.') || !source.endsWith('.js')) {
        return;
      }

      const filePath = path.join(rootDir, context.path.replace(/^\//, ''));
      const fileDir = path.dirname(filePath);
      const tsSource = `${source.slice(0, -3)}.ts`;
      const importedTsPath = path.join(fileDir, tsSource);

      try {
        await fs.access(importedTsPath);
        return tsSource;
      } catch {
        return;
      }
    },
  };
}
