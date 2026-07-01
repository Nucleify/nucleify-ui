import fs from 'node:fs/promises';
import path from 'node:path';

export function resolveTsImportsPlugin() {
  return {
    name: 'resolve-ts-imports',

    setup(build) {
      build.onResolve({ filter: /\.js$/ }, async (args) => {
        if (
          !args.importer ||
          (!args.path.startsWith('.') && !args.path.startsWith('/'))
        ) {
          return null;
        }

        const tsPath = args.path.replace(/\.js$/, '.ts');
        const resolvedTs = path.join(args.resolveDir, tsPath);

        try {
          await fs.access(resolvedTs);
          return { path: resolvedTs };
        } catch {
          return null;
        }
      });
    },
  };
}
