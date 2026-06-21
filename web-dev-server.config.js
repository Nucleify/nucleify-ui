import { fileURLToPath } from 'node:url';
import { esbuildPlugin } from '@web/dev-server-esbuild';
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
    esbuildPlugin({
      ts: true,
      target: 'esnext',
      tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
    }),
  ],
};
