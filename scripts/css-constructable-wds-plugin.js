import fs from 'node:fs/promises';
import path from 'node:path';

function cssToModule(css) {
  return `const sheet = new CSSStyleSheet();
sheet.replaceSync(${JSON.stringify(css)});
export default sheet;
`;
}

function rewriteCssImports(source) {
  return source
    .replace(
      /import\((['"])(\.[^'"]+?)\.css\1(?:,\s*\{\s*with:\s*\{\s*type:\s*['"]css['"]\s*\}\s*\})?\)/g,
      'import($1$2.css.js$1)',
    )
    .replace(
      /from\s*(['"])(\.[^'"]+?)\.css\1(?:\s*with\s*\{\s*type:\s*['"]css['"]\s*\})?/g,
      'from $1$2.css.js$1',
    );
}

/**
 * Dev-server equivalent of the production CSS constructable pipeline.
 */
export function cssConstructableWdsPlugin(rootDir) {
  return {
    name: 'css-constructable',

    transform(context) {
      if (!context.response.is('js')) {
        return;
      }

      const body = rewriteCssImports(context.body);

      if (body !== context.body) {
        return { body };
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
        };
      } catch {
        return;
      }
    },
  };
}
