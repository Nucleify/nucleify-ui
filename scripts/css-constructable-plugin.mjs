import fs from 'node:fs/promises';
import path from 'node:path';

function cssToModule(css) {
  return `
const sheet = new CSSStyleSheet();
sheet.replaceSync(${JSON.stringify(css)});
export default sheet;
`;
}

export function cssConstructablePlugin() {
  return {
    name: 'css-constructable',

    setup(build) {
      build.onResolve({ filter: /\.css(\?.*)?$/ }, (args) => {
        const cssPath = args.path.split('?')[0];
        const resolved = path.isAbsolute(cssPath)
          ? cssPath
          : path.join(args.resolveDir, cssPath);

        return {
          path: resolved,
          namespace: 'css-constructable',
        };
      });

      build.onLoad(
        { filter: /.*/, namespace: 'css-constructable' },
        async (args) => {
          const css = await fs.readFile(args.path, 'utf8');

          return {
            contents: cssToModule(css),
            loader: 'js',
            resolveDir: path.dirname(args.path),
          };
        },
      );
    },
  };
}
