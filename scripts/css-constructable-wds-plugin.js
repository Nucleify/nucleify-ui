import fs from 'node:fs/promises';
import path from 'node:path';

function cssToModule(css) {
  return `const sheet = new CSSStyleSheet();
sheet.replaceSync(${JSON.stringify(css)});
export default sheet;
`;
}

async function resolveCssSpec(spec, importerDir) {
  const cssFilePath = path.join(importerDir, `${spec}.css`);

  try {
    const stat = await fs.stat(cssFilePath);
    return `${spec}.css.js?v=${Math.trunc(stat.mtimeMs)}`;
  } catch {
    return `${spec}.css.js`;
  }
}

async function rewriteCssImports(source, importerDir) {
  let result = source;

  const dynamicMatches = [
    ...result.matchAll(
      /import\((['"])(\.[^'"]+?)\.css\1(?:,\s*\{\s*with:\s*\{\s*type:\s*['"]css['"]\s*\}\s*\})?\)/g,
    ),
  ];

  for (const match of dynamicMatches) {
    const [full, quote, spec] = match;
    const rewritten = await resolveCssSpec(spec, importerDir);
    result = result.replace(full, `import(${quote}${rewritten}${quote})`);
  }

  const staticMatches = [
    ...result.matchAll(
      /from\s*(['"])(\.[^'"]+?)\.css\1(?:\s*with\s*\{\s*type:\s*['"]css['"]\s*\})?/g,
    ),
  ];

  for (const match of staticMatches) {
    const [full, quote, spec] = match;
    const rewritten = await resolveCssSpec(spec, importerDir);
    result = result.replace(full, `from ${quote}${rewritten}${quote}`);
  }

  return result;
}

/**
 * Dev-server equivalent of the production CSS constructable pipeline.
 */
export function cssConstructableWdsPlugin(rootDir) {
  return {
    name: 'css-constructable',

    async transform(context) {
      if (!context.response.is('js')) {
        return;
      }

      if (!context.body.includes('.css')) {
        return;
      }

      const importerPath = path.join(rootDir, context.path.replace(/^\//, ''));
      const importerDir = path.dirname(importerPath);
      const body = await rewriteCssImports(context.body, importerDir);

      if (body !== context.body) {
        return {
          body,
          transformCache: false,
        };
      }
    },

    async serve(context) {
      if (!context.path.endsWith('.css.js')) {
        return;
      }

      const cssRelativePath = context.path.replace(/\.js$/, '');
      const cssFilePath = path.join(
        rootDir,
        cssRelativePath.replace(/^\//, ''),
      );

      try {
        const css = await fs.readFile(cssFilePath, 'utf8');
        return {
          body: cssToModule(css),
          type: 'js',
          headers: {
            'cache-control': 'no-cache, no-store, must-revalidate',
          },
        };
      } catch {
        return;
      }
    },
  };
}
