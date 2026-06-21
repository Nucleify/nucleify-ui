import { html, type TemplateResult } from 'lit';
import type { PlaygroundDefinition } from '../types.js';

export function renderNav(
  definitions: PlaygroundDefinition[],
  selectedTag: string,
  onSelect: (tag: string) => void,
): TemplateResult {
  return html`
    <aside>
      <h2>Components</h2>
      <nav>
        ${definitions.map(
          (definition) => html`
            <button
              aria-current=${definition.tag === selectedTag ? 'true' : 'false'}
              @click=${() => onSelect(definition.tag)}
            >
              ${definition.label}
            </button>
          `,
        )}
      </nav>
    </aside>
  `;
}
