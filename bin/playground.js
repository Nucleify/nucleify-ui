#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

const configCandidates = [
  path.join(packageRoot, 'scripts/web-dev-server.config.js'),
  path.join(packageRoot, 'web-dev-server.config.js'),
];
const configPath = configCandidates.find((candidate) => existsSync(candidate));

if (!configPath) {
  console.error(
    'Missing web-dev-server config in nucleify-ui. Reinstall the package:\n' +
      '  pnpm update nucleify-ui --force\n' +
      'Expected one of:\n' +
      configCandidates.map((candidate) => `  - ${candidate}`).join('\n'),
  );
  process.exit(1);
}
const requireFromPackage = createRequire(
  path.join(packageRoot, 'package.json'),
);
const requireFromCaller = createRequire(import.meta.url);

const resolveDevServerBin = (requireFn) => {
  const devServerMain = requireFn.resolve('@web/dev-server');
  return path.join(path.dirname(devServerMain), 'bin.js');
};

let devServerBin;

try {
  devServerBin = resolveDevServerBin(requireFromPackage);
} catch {
  try {
    devServerBin = resolveDevServerBin(requireFromCaller);
  } catch {
    console.error(
      'Missing @web/dev-server. Reinstall nucleify-ui or add @web/dev-server@0.4.6 to your project.',
    );
    process.exit(1);
  }
}

const child = spawn(process.execPath, [devServerBin, '--config', configPath], {
  cwd: packageRoot,
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
