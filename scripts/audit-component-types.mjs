import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

function defaultRootDir() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
}

function toClassName(componentName) {
  return componentName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function auditComponentTypes(rootDir = defaultRootDir()) {
  const srcDir = path.join(rootDir, 'src');
  const distDir = path.join(rootDir, 'dist');

  const componentFiles = await glob('components/nui-*/nui-*.ts', {
    cwd: srcDir,
  });
  const tags = componentFiles
    .map((relativePath) => path.basename(path.dirname(relativePath)))
    .sort();

  const summary = {
    total: tags.length,
    withCustomEvents: 0,
    withManualEventMap: 0,
    withoutEvents: 0,
  };
  const issues = [];

  for (const tag of tags) {
    const className = toClassName(tag);
    const componentDir = path.join(srcDir, 'components', tag);
    const dtsPath = path.join(distDir, 'components', tag, `${tag}.d.ts`);
    const typesPath = path.join(componentDir, 'types.ts');

    let dts = '';
    try {
      dts = await readFile(dtsPath, 'utf8');
    } catch {
      issues.push({ tag, kind: 'missing-dts' });
      continue;
    }

    if (/declare class \w+ extends LitElement \{\}/.test(dts)) {
      issues.push({ tag, kind: 'stub-dts' });
    }

    if (!dts.includes(`export declare class ${className}`)) {
      issues.push({ tag, kind: 'missing-class-declaration' });
    }

    if (!dts.includes('HTMLElementTagNameMap')) {
      issues.push({ tag, kind: 'missing-tag-name-map' });
    }

    const classMatch = dts.match(
      /export declare class [\s\S]*?\{([\s\S]*?)\n\}/,
    );
    const classBody = classMatch?.[1] ?? '';
    const hasPublicMember = /^\s+(?!private |protected )[\w'"`]/m.test(
      classBody,
    );

    if (!hasPublicMember) {
      issues.push({ tag, kind: 'no-public-members' });
    }

    const sources = await glob('**/*.ts', {
      cwd: componentDir,
      ignore: ['**/*.test.ts'],
    });
    const combined = (
      await Promise.all(
        sources.map((file) => readFile(path.join(componentDir, file), 'utf8')),
      )
    ).join('\n');

    const events = [
      ...new Set(
        [...combined.matchAll(/new CustomEvent\(\s*['"]([^'"]+)['"]/g)].map(
          (match) => match[1],
        ),
      ),
    ].sort();

    let typesSrc = '';
    try {
      typesSrc = await readFile(typesPath, 'utf8');
    } catch {
      // no types.ts
    }

    const manualMap = new RegExp(
      `export interface ${className}EventMap\\b`,
    ).test(typesSrc);
    const hasListenerAugment = dts.includes(
      `addEventListener<K extends keyof ${className}EventMap>`,
    );
    const hasFallbackMap = dts.includes(
      `export interface ${className}EventMap {`,
    );

    if (events.length > 0) {
      summary.withCustomEvents++;

      if (manualMap) {
        summary.withManualEventMap++;

        if (!hasListenerAugment) {
          issues.push({ tag, kind: 'manual-event-map-without-listeners' });
        }

        for (const eventName of events) {
          const eventPattern = new RegExp(
            `(?:['"]${escapeRegExp(eventName)}['"]|${escapeRegExp(eventName)})\\s*:`,
          );
          if (!eventPattern.test(typesSrc)) {
            issues.push({ tag, kind: 'event-not-in-manual-map', eventName });
          }
        }

        const mappedEvents = [
          ...typesSrc.matchAll(
            /^\s*(?:['"]([^'"]+)['"]|([A-Za-z_$][\w$-]*))\s*:\s*CustomEvent/gm,
          ),
        ].map((match) => match[1] ?? match[2]);

        const dynamicEvents = new Set();
        if (
          /new CustomEvent\(\s*eventName/.test(combined) &&
          /nui-node-expand/.test(typesSrc)
        ) {
          dynamicEvents.add('nui-node-expand');
          dynamicEvents.add('nui-node-collapse');
        }
        if (/new CustomEvent\(\s*next \? 'show' : 'hide'/.test(combined)) {
          dynamicEvents.add('show');
          dynamicEvents.add('hide');
        }

        for (const mappedEvent of mappedEvents) {
          if (events.includes(mappedEvent) || dynamicEvents.has(mappedEvent)) {
            continue;
          }

          issues.push({
            tag,
            kind: 'mapped-event-not-dispatched',
            eventName: mappedEvent,
          });
        }
      } else if (!hasFallbackMap || !hasListenerAugment) {
        issues.push({
          tag,
          kind: 'custom-events-without-typed-map',
          events,
        });
      }
    } else {
      summary.withoutEvents++;

      if (manualMap) {
        issues.push({ tag, kind: 'manual-event-map-without-dispatch' });
      }

      if (hasListenerAugment || hasFallbackMap) {
        issues.push({ tag, kind: 'listener-augment-without-dispatch' });
      }
    }
  }

  const realIssues = issues.filter(
    (issue) => issue.kind !== 'no-public-members',
  );

  return { summary, issueCount: realIssues.length, issues: realIssues };
}

const isCli = process.argv[1] === fileURLToPath(import.meta.url);

if (isCli) {
  const result = await auditComponentTypes();
  console.log(JSON.stringify(result, null, 2));

  if (result.issueCount > 0) {
    process.exit(1);
  }
}
