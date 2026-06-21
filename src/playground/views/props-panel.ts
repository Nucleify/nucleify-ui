import { html, type TemplateResult } from 'lit';
import type { PlaygroundControl, PlaygroundProps } from '../types.js';
import { groupControlsBySection } from '../types.js';

export function renderPropsPanel(
  controls: PlaygroundControl[],
  values: PlaygroundProps,
  onChange: (key: string, value: string | boolean) => void,
): TemplateResult {
  const sections = groupControlsBySection(controls);

  return html`
    <div class="props-panel">
      <h3>Attributes</h3>
      ${[...sections.entries()].map(
        ([section, sectionControls]) => html`
          <div class="props-section">
            <h4>${section}</h4>
            <div class="props-grid">
              ${sectionControls.map((control) =>
                renderControlField(control, values[control.key], onChange),
              )}
            </div>
          </div>
        `,
      )}
    </div>
  `;
}

function renderControlField(
  control: PlaygroundControl,
  value: string | boolean | undefined,
  onChange: (key: string, value: string | boolean) => void,
): TemplateResult {
  if (control.type === 'boolean') {
    return html`
      <div class="prop-field">
        <label for=${control.key}>${control.label}</label>
        <input
          id=${control.key}
          type="checkbox"
          .checked=${Boolean(value)}
          @change=${(event: Event) =>
            onChange(control.key, (event.target as HTMLInputElement).checked)}
        />
      </div>
    `;
  }

  if (control.type === 'select') {
    return html`
      <div class="prop-field">
        <label for=${control.key}>${control.label}</label>
        <select
          id=${control.key}
          .value=${String(value ?? '')}
          @change=${(event: Event) =>
            onChange(control.key, (event.target as HTMLSelectElement).value)}
        >
          ${control.options?.map(
            (option) =>
              html`<option value=${option.value}>${option.label}</option>`,
          )}
        </select>
      </div>
    `;
  }

  return html`
    <div class="prop-field">
      <label for=${control.key}>${control.label}</label>
      <input
        id=${control.key}
        type="text"
        .value=${String(value ?? '')}
        placeholder=${control.placeholder ?? ''}
        @input=${(event: Event) =>
          onChange(control.key, (event.target as HTMLInputElement).value)}
      />
    </div>
  `;
}
