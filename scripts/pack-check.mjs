import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const rootDir = fileURLToPath(new URL('..', import.meta.url));

async function run(command, args, options = {}) {
  await execFileAsync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    ...options,
  });
}

async function runIn(cwd, command, args) {
  await execFileAsync(command, args, { cwd, stdio: 'inherit' });
}

async function main() {
  await run('npm', ['run', 'build']);

  const { stdout } = await execFileAsync('npm', ['pack'], { cwd: rootDir });
  const tarballName = stdout.trim().split('\n').pop();
  if (!tarballName) {
    throw new Error('npm pack did not produce a tarball name');
  }

  const tarballPath = path.join(rootDir, tarballName);
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'nucleify-ui-pack-'));

  try {
    await runIn(tmpDir, 'npm', ['init', '-y']);
    await runIn(tmpDir, 'npm', ['install', tarballPath]);
    await runIn(tmpDir, 'npm', ['install', 'happy-dom']);

    const { createRequire } = await import('node:module');
    const requireFromPkg = createRequire(path.join(tmpDir, 'package.json'));
    const typeSubpaths = [
      'nucleify-ui/components/nui-button/types',
      'nucleify-ui/components/nui-dialog/types',
      'nucleify-ui/types/component-events',
      'nucleify-ui/types/nui-type',
    ];

    for (const subpath of typeSubpaths) {
      requireFromPkg.resolve(subpath);
    }

    const smoke = `
import { Window } from 'happy-dom';

const window = new Window();
globalThis.window = window;
globalThis.document = window.document;
globalThis.customElements = window.customElements;
globalThis.HTMLElement = window.HTMLElement;

import { applyTheme } from 'nucleify-ui/theme';
import { nucleifyStyles } from 'nucleify-ui/config';
import 'nucleify-ui/components/nui-button';

applyTheme('nuxt', 'dark');
nucleifyStyles({ 'nui-button': '/styles/nui-button.css' });
console.log('ok');
`;
    const smokePath = path.join(tmpDir, 'smoke.mjs');
    await writeFile(smokePath, smoke);
    await runIn(tmpDir, 'node', [smokePath]);
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
    await rm(tarballPath, { force: true });
  }
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
