import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

const EVENT_RE = /new CustomEvent\(\s*['"]([^'"]+)['"]/g;
const SLOT_RE = /<slot(?:\s+name=(['"])([^'"]+)\1)?/g;
const MANUAL_EVENT_MAP_RE = (className) =>
  new RegExp(`export interface ${className}EventMap\\b`);

function toClassName(componentName) {
  return componentName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function collectEvents(source) {
  const events = new Set();

  for (const match of source.matchAll(EVENT_RE)) {
    events.add(match[1]);
  }

  return [...events].sort();
}

function collectSlots(source) {
  const slots = [];
  const seen = new Set();

  for (const match of source.matchAll(SLOT_RE)) {
    const name = match[2] ?? 'default';

    if (seen.has(name)) {
      continue;
    }

    seen.add(name);
    slots.push(name);
  }

  return slots;
}

function slotDescription(name) {
  if (name === 'default') {
    return 'Default slot content';
  }

  return `${name.replaceAll('-', ' ')} slot content`;
}

function buildSlotJsdoc(slots) {
  if (slots.length === 0) {
    return '';
  }

  const lines = slots.map((name) => {
    if (name === 'default') {
      return ' * @slot - Default slot content';
    }

    return ` * @slot ${name} - ${slotDescription(name)}`;
  });

  return `/**\n${lines.join('\n')}\n */\n`;
}

function buildListenerAugmentation(className) {
  return `
export interface ${className} {
  addEventListener<K extends keyof ${className}EventMap>(
    type: K,
    listener: (this: ${className}, ev: ${className}EventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof ${className}EventMap>(
    type: K,
    listener: (this: ${className}, ev: ${className}EventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
}
`;
}

function buildFallbackEventAugmentation(className, events) {
  const eventLines = events
    .map((eventName) => `  '${eventName}': CustomEvent;`)
    .join('\n');

  return `
export interface ${className}EventMap {
${eventLines}
}
${buildListenerAugmentation(className)}`;
}

function buildEventAugmentation(className, { manual, scannedEvents }) {
  if (manual) {
    return buildListenerAugmentation(className);
  }

  if (scannedEvents.length === 0) {
    return '';
  }

  return buildFallbackEventAugmentation(className, scannedEvents);
}

function ensureEventMapImport(content, className, manual) {
  if (!manual) {
    return content;
  }

  const eventMapName = `${className}EventMap`;
  const typeImportRe = /import type \{([^}]+)\} from '\.\/types\.js';/;

  let updated = content.replace(
    new RegExp(
      `export type \\{ ${eventMapName} \\} from '\\.\\/types\\.js';\\n?`,
    ),
    '',
  );

  if (typeImportRe.test(updated)) {
    updated = updated.replace(typeImportRe, (_match, imports) => {
      if (imports.includes(eventMapName)) {
        return _match;
      }

      const importNames = imports
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean);

      return `import type { ${[...importNames, eventMapName].join(', ')} } from './types.js';`;
    });
  } else {
    updated = `import type { ${eventMapName} } from './types.js';\n${updated}`;
  }

  const reExport = `export type { ${eventMapName} };`;
  if (!updated.includes(reExport)) {
    const importMatch = updated.match(
      /import type \{[^}]+\} from '\.\/types\.js';\n/,
    );

    if (importMatch) {
      const insertAt = importMatch.index + importMatch[0].length;
      updated = `${updated.slice(0, insertAt)}${reExport}\n${updated.slice(insertAt)}`;
    }
  }

  return updated;
}

function insertBeforeDeclareGlobal(content, insertion) {
  const marker = 'declare global';

  if (!insertion) {
    return content;
  }

  const index = content.indexOf(marker);

  if (index === -1) {
    return `${content.trimEnd()}\n${insertion}`;
  }

  return `${content.slice(0, index).trimEnd()}\n${insertion}\n${content.slice(index)}`;
}

function insertClassJsdoc(content, className, jsdoc) {
  if (!jsdoc) {
    return content;
  }

  const classDecl = `export declare class ${className}`;
  const index = content.indexOf(classDecl);

  if (index === -1) {
    return content;
  }

  return `${content.slice(0, index)}${jsdoc}${content.slice(index)}`;
}

async function readComponentSources(componentDir) {
  const files = await glob('**/*.ts', {
    cwd: componentDir,
    ignore: ['**/*.test.ts'],
  });

  return Promise.all(
    files.map((relativePath) =>
      readFile(path.join(componentDir, relativePath), 'utf8'),
    ),
  );
}

async function readTypesSource(componentDir) {
  try {
    return await readFile(path.join(componentDir, 'types.ts'), 'utf8');
  } catch {
    return '';
  }
}

export async function augmentComponentDeclarations() {
  const componentFiles = await glob('components/nui-*/nui-*.ts', {
    cwd: srcDir,
  });

  for (const relativePath of componentFiles) {
    const componentName = path.basename(relativePath, '.ts');
    const className = toClassName(componentName);
    const componentDir = path.join(srcDir, path.dirname(relativePath));
    const declarationPath = path.join(
      distDir,
      path.dirname(relativePath),
      `${componentName}.d.ts`,
    );

    const sources = await readComponentSources(componentDir);
    const typesSource = await readTypesSource(componentDir);
    const combinedSource = sources.join('\n');
    const scannedEvents = collectEvents(combinedSource);
    const slots = collectSlots(combinedSource);
    const manual = MANUAL_EVENT_MAP_RE(className).test(typesSource);

    let content = await readFile(declarationPath, 'utf8');
    content = ensureEventMapImport(content, className, manual);
    content = insertClassJsdoc(content, className, buildSlotJsdoc(slots));
    content = insertBeforeDeclareGlobal(
      content,
      buildEventAugmentation(className, { manual, scannedEvents }),
    );

    await writeFile(declarationPath, content);
  }
}
