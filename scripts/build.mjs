import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import { glob } from 'glob';
import { cssConstructablePlugin } from './css-constructable-plugin.mjs';
import { resolveTsImportsPlugin } from './resolve-ts-imports-plugin.mjs';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

function cssToModule(css) {
  return `const sheet = new CSSStyleSheet();
sheet.replaceSync(${JSON.stringify(css)});
export default sheet;
`;
}

async function emitCssModules() {
  const cssFiles = await glob('**/*.css', {
    cwd: srcDir,
    ignore: ['styles/**'],
  });

  for (const relativeCssPath of cssFiles) {
    const css = await readFile(path.join(srcDir, relativeCssPath), 'utf8');
    const outPath = path.join(distDir, `${relativeCssPath}.js`);

    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, cssToModule(css));
  }
}

async function rewriteCssImports() {
  const jsFiles = await glob('**/*.js', { cwd: distDir });

  for (const relativeJsPath of jsFiles) {
    const filePath = path.join(distDir, relativeJsPath);
    const content = await readFile(filePath, 'utf8');
    const updated = content
      .replace(
        /import\((['"])(\.[^'"]+?)\.css\1(?:,\s*\{\s*with:\s*\{\s*type:\s*['"]css['"]\s*\}\s*\})?\)/g,
        'import($1$2.css.js$1)',
      )
      .replace(
        /from\s*(['"])(\.[^'"]+?)\.css\1(?:\s*with\s*\{\s*type:\s*['"]css['"]\s*\})?/g,
        'from $1$2.css.js$1',
      );

    if (updated !== content) {
      await writeFile(filePath, updated);
    }
  }
}

async function emitComponentTypes() {
  const componentFiles = await glob('components/nui-*/nui-*.ts', {
    cwd: srcDir,
  });

  for (const relativePath of componentFiles) {
    const componentName = path.basename(relativePath, '.ts');
    const className = componentName
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    const declaration = `import { LitElement } from 'lit';

declare class ${className} extends LitElement {}

export { ${className} };
`;

    const outPath = path.join(
      distDir,
      path.dirname(relativePath),
      `${componentName}.d.ts`,
    );
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, declaration);
  }
}

async function emitEntryTypes() {
  const entries = ['index.ts', 'config.ts', 'theme.ts', 'types/nui-type.ts'];
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const execFileAsync = promisify(execFile);

  await execFileAsync(
    process.execPath,
    [
      path.join(rootDir, 'node_modules/typescript/bin/tsc'),
      ...entries.map((entry) => path.join('src', entry)),
      '--declaration',
      '--emitDeclarationOnly',
      '--outDir',
      distDir,
      '--module',
      'esnext',
      '--target',
      'es2021',
      '--moduleResolution',
      'bundler',
      '--experimentalDecorators',
      '--skipLibCheck',
    ],
    { cwd: rootDir },
  );
}

const libraryEntries = await glob('**/*.ts', {
  cwd: srcDir,
  ignore: ['playground/**'],
});

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

await esbuild.build({
  absWorkingDir: rootDir,
  entryPoints: libraryEntries.map((entry) => path.join('src', entry)),
  outdir: distDir,
  outbase: 'src',
  format: 'esm',
  platform: 'browser',
  target: 'es2021',
  bundle: false,
  sourcemap: true,
  plugins: [resolveTsImportsPlugin(), cssConstructablePlugin()],
});

await emitCssModules();
await rewriteCssImports();
await cp(path.join(srcDir, 'styles'), path.join(distDir, 'styles'), {
  recursive: true,
});
await emitComponentTypes();
await emitEntryTypes();

console.log(`Built ${libraryEntries.length} library modules into dist/`);
