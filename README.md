# <div align="center"> <img src="https://github.com/Nucleify/Nucleify/blob/prod/public/img/logo.svg" width="70"> <br> nucleify-ui <br> </div>

- **GitHub (this package)**: https://github.com/Nucleify/nucleify-ui
- **GitHub (framework using this package)**: https://github.com/Nucleify/Nucleify

If you like this project, consider leaving a ⭐ on GitHub. Thank you! <3

---

Lit 3 web component library. Import only the components you use — your bundler will include just those modules.

## Install

```bash
npm install nucleify-ui
```

Peer dependencies (install in your app if not already present):

```bash
npm install lit iconify-icon
# optional, only for nui-chart:
npm install chart.js
```

## Use components

Register components with side-effect imports:

```typescript
import 'nucleify-ui/components/nui-button';
import 'nucleify-ui/components/nui-dialog';
```

Apply theme tokens on `document.body`:

```typescript
import { applyTheme } from 'nucleify-ui/theme';

applyTheme('nuxt', 'dark');
```

Load global styles in your app entry:

```typescript
import 'nucleify-ui/styles/global.css';
import 'nucleify-ui/styles/variables.css';
```

Then use tags in HTML or JSX:

```html
<nui-button label="Save" severity="primary"></nui-button>
```

### Tree-shaking

Each component is a separate export. Import only what you need:

```typescript
import 'nucleify-ui/components/nui-button';
import 'nucleify-ui/components/nui-dialog';
```

With Vite or esbuild, unused components stay out of the client bundle. `lit`, `iconify-icon`, and (optionally) `chart.js` should be installed once in your app — they are peer dependencies.

Example Vite entry:

```typescript
import 'nucleify-ui/styles/variables.css';
import 'nucleify-ui/styles/global.css';
import { applyTheme } from 'nucleify-ui/theme';
import 'nucleify-ui/components/nui-button';

applyTheme('nuxt', 'dark');
```

## Override component CSS

Pass a map of component tags to CSS file paths. Call **before** importing components.

**Option A** — one call in `main.ts` (paths relative to your entry file):

```typescript
import { nucleifyStyles } from 'nucleify-ui/config';

nucleifyStyles(
  {
    'nui-button': './styles/nui-button.css',
    'nui-card': './styles/nui-card.css',
  },
  import.meta.url,
);

import 'nucleify-ui/components/nui-button';
```

**Option B** — config file with only the map (recommended):

```typescript
// nucleify-ui.config.ts
import { createNucleifyStyles } from 'nucleify-ui/config';

const nucleifyStyles = createNucleifyStyles(import.meta.url);

nucleifyStyles({
  'nui-button': './styles/nui-button.css',
  'nui-card': './styles/nui-card.css',
});
```

```typescript
// main.ts
import './nucleify-ui.config.js';
import 'nucleify-ui/components/nui-button';
```

**Option C** — CSS in `public/` (no `import.meta.url`):

```typescript
nucleifyStyles({
  'nui-button': '/styles/nui-button.css',
});
```

Copy defaults from `node_modules/nucleify-ui/dist/components/nui-button/styles.css` as a starting point.

Use `unstyled` on a component instance to disable styles for that element only.

## Playground

After installing in a project, add to your `package.json`:

```json
{
  "scripts": {
    "playground": "nucleify-ui-playground"
  }
}
```

Run:

```bash
npm run playground
```

This starts the interactive component playground from the installed package (port 8000 by default).

## Local development (this repo)

```bash
npm install
npm run start     # or npm run playground
npm run build
npm run check
```

## Package exports

| Import | Description |
|--------|-------------|
| `nucleify-ui` | Theme helpers, config API, shared types |
| `nucleify-ui/config` | `nucleifyStyles()` — CSS overrides |
| `nucleify-ui/theme` | `applyTheme()` |
| `nucleify-ui/styles/*` | CSS token files |
| `nucleify-ui/components/nui-*` | Individual web components |
