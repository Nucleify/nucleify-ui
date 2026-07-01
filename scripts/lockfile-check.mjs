import { execFile } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const rootDir = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '..',
);
const lockPath = path.join(rootDir, 'package-lock.json');

async function main() {
  let before = '';
  try {
    before = await readFile(lockPath, 'utf8');
  } catch {
    // No lockfile – treat as failure for deterministic installs.
    throw new Error('package-lock.json is missing');
  }

  // Re-generate lockfile deterministically and compare.
  await execFileAsync(
    'npm',
    ['install', '--package-lock-only', '--ignore-scripts', '--silent'],
    { cwd: rootDir },
  );

  const after = await readFile(lockPath, 'utf8');

  if (after !== before) {
    // Restore original to avoid dirty working tree.
    await writeFile(lockPath, before);
    throw new Error(
      'package-lock.json is out of date (run npm install and commit the updated lockfile)',
    );
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
