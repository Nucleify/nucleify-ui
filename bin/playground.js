#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const configPath = path.join(packageRoot, 'web-dev-server.config.js');
const require = createRequire(import.meta.url);

let devServerBin;

try {
  const devServerPackage = require.resolve('@web/dev-server/package.json');
  devServerBin = path.join(path.dirname(devServerPackage), 'dist', 'bin.js');
} catch {
  console.error(
    'Missing @web/dev-server. Reinstall nucleify-ui or add @web/dev-server to your project.',
  );
  process.exit(1);
}

const child = spawn(process.execPath, [devServerBin, '--config', configPath], {
  cwd: packageRoot,
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
