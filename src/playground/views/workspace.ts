import { html, nothing, type TemplateResult } from 'lit';
import type { PlaygroundDefinition, PlaygroundProps } from '../types.js';
import { renderPropsPanel } from './props-panel.js';

export function renderWorkspace(
  definition: PlaygroundDefinition,
  props: PlaygroundProps,
  onPropChange: (key: string, value: string | boolean) => void,
  onReset: () => void,
): TemplateResult {
  const previewClass = definition.getPreviewClass?.(props) ?? '';
  const preview = definition.renderPreview(props);

  return html`
    <div class="preview-panel">
      <div class="panel-header">
        <h2>${definition.label}</h2>
        <button class="reset-button" type="button" @click=${onReset}>
          Reset attributes
        </button>
      </div>
      ${
        definition.description
          ? html`<p class="description">${definition.description}</p>`
          : nothing
      }
      <div class="preview-box ${previewClass}">${preview}</div>
      ${renderPropsPanel(definition.controls, props, onPropChange)}
      <div class="usage">${definition.formatUsage(props)}</div>
    </div>
  `;
}
