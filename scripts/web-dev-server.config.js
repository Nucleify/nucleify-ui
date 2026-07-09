import { fileURLToPath } from 'node:url';
import { fromRollup } from '@web/dev-server-rollup';
import rollupEsbuild from 'rollup-plugin-esbuild';
import { cssConstructableWdsPlugin } from './css-constructable-wds-plugin.js';
import { resolveTsImportsPlugin } from './resolve-ts-imports-wds-plugin.js';

const packageRoot = fileURLToPath(new URL('..', import.meta.url));

export default {
  open: true,
  watch: true,
  appIndex: 'index.html',
  mimeTypes: {
    '**/*.ts': 'js',
    '**/*.tsx': 'js',
  },
  nodeResolve: {
    exportConditions: ['development'],
  },
  plugins: [
    cssConstructableWdsPlugin(packageRoot),
    resolveTsImportsPlugin(packageRoot),
    fromRollup(rollupEsbuild)({
      target: 'esnext',
      tsconfig: fileURLToPath(new URL('../tsconfig.json', import.meta.url)),
      include: /\.(ts|tsx|js|jsx)$/,
    }),
  ],
};
