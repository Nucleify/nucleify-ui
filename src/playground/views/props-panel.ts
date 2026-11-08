import '../../components/nui-checkbox/nui-checkbox.js';
import '../../components/nui-heading/nui-heading.js';
import '../../components/nui-input-text/nui-input-text.js';
import '../../components/nui-label/nui-label.js';
import '../../components/nui-select/nui-select.js';
import '../../components/nui-textarea/nui-textarea.js';
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
      <nui-heading
        class="playground-props-title"
        tag="3"
        text="Attributes"
        unstyled
      ></nui-heading>
      ${[...sections.entries()].map(
        ([section, sectionControls]) => html`
          <div class="props-section">
            <nui-heading
              class="playground-section-title"
              tag="4"
              text=${section}
              unstyled
            ></nui-heading>
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

function handleValueInput(
  event: Event,
  key: string,
  onChange: (key: string, value: string | boolean) => void,
): void {
  const detail = (event as CustomEvent<{ value?: string }>).detail;
  if (!detail || typeof detail !== 'object' || !('value' in detail)) {
    return;
  }

  onChange(key, String(detail.value ?? ''));
}

function renderControlField(
  control: PlaygroundControl,
  value: string | boolean | undefined,
  onChange: (key: string, value: string | boolean) => void,
): TemplateResult {
  if (control.type === 'boolean') {
    return html`
      <div class="prop-field">
        <nui-label value=${control.label}></nui-label>
        <nui-checkbox
          input-id=${control.key}
          aria-label=${control.label}
          .checked=${Boolean(value)}
          @change=${(event: CustomEvent<{ checked: boolean }>) =>
            onChange(control.key, Boolean(event.detail?.checked))}
        ></nui-checkbox>
      </div>
    `;
  }

  if (control.type === 'select') {
    const current = String(value ?? '');

    return html`
      <div class="prop-field">
        <nui-label value=${control.label}></nui-label>
        <nui-select
          fluid
          .value=${current}
          .options=${control.options ?? []}
          @nui-change=${(event: CustomEvent<{ value: string }>) =>
            onChange(control.key, String(event.detail?.value ?? ''))}
        ></nui-select>
      </div>
    `;
  }

  if (control.type === 'textarea') {
    return html`
      <div class="prop-field${control.fullWidth ? ' prop-field--full' : ''}">
        <nui-label value=${control.label}></nui-label>
        <nui-textarea
          fluid
          textarea-id=${control.key}
          aria-label=${control.label}
          rows=${control.rows ?? 4}
          .value=${String(value ?? '')}
          placeholder=${control.placeholder ?? ''}
          @input=${(event: Event) => handleValueInput(event, control.key, onChange)}
        ></nui-textarea>
      </div>
    `;
  }

  return html`
    <div class="prop-field">
      <nui-label value=${control.label}></nui-label>
      <nui-input-text
        fluid
        input-id=${control.key}
        aria-label=${control.label}
        .value=${String(value ?? '')}
        placeholder=${control.placeholder ?? ''}
        @input=${(event: Event) => handleValueInput(event, control.key, onChange)}
      ></nui-input-text>
    </div>
  `;
}
