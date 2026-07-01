import { fileURLToPath } from 'node:url';
import { fromRollup } from '@web/dev-server-rollup';
import rollupEsbuild from 'rollup-plugin-esbuild';
import { resolveTsImportsPlugin } from './resolve-ts-imports-plugin.js';

export default {
  open: true,
  watch: true,
  appIndex: 'index.html',
  nodeResolve: {
    exportConditions: ['development'],
  },
  plugins: [
    resolveTsImportsPlugin(fileURLToPath(new URL('.', import.meta.url))),
    fromRollup(
      rollupEsbuild({
        target: 'esnext',
        tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
      }),
    ),
  ],
};
