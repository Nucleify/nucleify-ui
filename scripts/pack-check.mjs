import { execFile } from 'node:child_process';
import { access, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
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

    const pkgRoot = path.dirname(
      requireFromPkg.resolve('nucleify-ui/package.json'),
    );
    const playgroundFiles = [
      'scripts/css-constructable-wds-plugin.js',
      'scripts/web-dev-server.config.js',
      'scripts/resolve-ts-imports-wds-plugin.js',
      'tsconfig.json',
      'bin/playground.js',
    ];

    for (const file of playgroundFiles) {
      await access(path.join(pkgRoot, file));
    }

    await access(
      path.join(pkgRoot, 'dist/components/nui-button/styles.css.js'),
    );
    await access(path.join(pkgRoot, 'dist/styles/variables.css'));
    await access(path.join(pkgRoot, 'dist/styles/global.css'));

    await import(
      pathToFileURL(path.join(pkgRoot, 'scripts/web-dev-server.config.js')).href
    );

    const smoke = `
import { Window } from 'happy-dom';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const window = new Window({ url: 'https://example.com/' });
const g = globalThis;
g.window = window;
g.document = window.document;
g.Document = window.Document;
g.customElements = window.customElements;
g.HTMLElement = window.HTMLElement;
g.DocumentFragment = window.DocumentFragment;
g.ShadowRoot = window.ShadowRoot;
g.Element = window.Element;
g.Node = window.Node;
g.Event = window.Event;
g.CustomEvent = window.CustomEvent;
g.MutationObserver = window.MutationObserver;
g.CSSStyleSheet = window.CSSStyleSheet;
g.getComputedStyle = window.getComputedStyle.bind(window);
g.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
g.cancelAnimationFrame = (id) => clearTimeout(id);

if (!('adoptedStyleSheets' in Document.prototype)) {
  Object.defineProperty(Document.prototype, 'adoptedStyleSheets', {
    configurable: true,
    get() { return this.__adoptedStyleSheets ?? []; },
    set(v) { this.__adoptedStyleSheets = Array.isArray(v) ? v : []; },
  });
}
if (!('adoptedStyleSheets' in ShadowRoot.prototype)) {
  Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
    configurable: true,
    get() { return this.__adoptedStyleSheets ?? []; },
    set(v) { this.__adoptedStyleSheets = Array.isArray(v) ? v : []; },
  });
}

const requireFromPkg = createRequire(path.join(process.cwd(), 'package.json'));
const pkgRoot = path.dirname(requireFromPkg.resolve('nucleify-ui/package.json'));

// Packaged constructable CSS module must evaluate and expose real CSS text.
const cssModule = await import(
  pathToFileURL(path.join(pkgRoot, 'dist/components/nui-button/styles.css.js')).href
);
if (!(cssModule.default instanceof CSSStyleSheet)) {
  throw new Error('styles.css.js did not export a CSSStyleSheet');
}
const packagedCss = await readFile(
  path.join(pkgRoot, 'dist/components/nui-button/styles.css.js'),
  'utf8',
);
if (!packagedCss.includes('.nui-button') || !packagedCss.includes('replaceSync')) {
  throw new Error('packaged styles.css.js is missing expected button CSS');
}

const { applyTheme } = await import('nucleify-ui/theme');
const { nucleifyStyles } = await import('nucleify-ui/config');
await import('nucleify-ui/components/nui-button');
await import('nucleify-ui/components/nui-file-upload');

applyTheme('nuxt', 'dark');

async function waitForSheets(el, predicate, label) {
  for (let i = 0; i < 50; i++) {
    await new Promise((r) => setTimeout(r, 20));
    const sheets = el.shadowRoot?.adoptedStyleSheets ?? [];
    if (predicate(sheets)) return sheets;
  }
  throw new Error(label);
}

const button = document.createElement('nui-button');
button.setAttribute('label', 'Pack check');
document.body.appendChild(button);
await button.updateComplete;

const defaultSheets = await waitForSheets(
  button,
  (sheets) => sheets.length === 1,
  'nui-button did not adopt default styles from the installed package',
);

const override = new CSSStyleSheet();
override.replaceSync('.nui-button { color: rgb(1, 2, 3); }');
nucleifyStyles({ 'nui-button': override });

button.unstyled = true;
await button.updateComplete;
await waitForSheets(
  button,
  (sheets) => sheets.length === 0,
  'nui-button unstyled did not clear adoptedStyleSheets',
);

button.unstyled = false;
await button.updateComplete;
await waitForSheets(
  button,
  (sheets) => sheets[0] === override,
  'nui-button did not apply CSSStyleSheet override',
);

const override2 = new CSSStyleSheet();
override2.replaceSync('.nui-button { color: rgb(4, 5, 6); }');
nucleifyStyles({ 'nui-button': override2 });

button.unstyled = true;
await button.updateComplete;
button.unstyled = false;
await button.updateComplete;
await waitForSheets(
  button,
  (sheets) => sheets[0] === override2,
  'nui-button did not refresh styles after nucleifyStyles override change',
);

const upload = document.createElement('nui-file-upload');
document.body.appendChild(upload);
await upload.updateComplete;
await waitForSheets(
  upload,
  (sheets) => sheets.length === 1,
  'nui-file-upload did not adopt styles (must use createComponentStyles, not static styles)',
);

if (defaultSheets === override2) {
  throw new Error('unexpected shared stylesheet identity');
}

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
