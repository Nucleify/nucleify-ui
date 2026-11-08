import '../../components/nui-button/nui-button.js';
import { html, nothing, type TemplateResult } from 'lit';
import type { PlaygroundDefinition, PlaygroundProps } from '../types.js';
import { renderPropsPanel } from './props-panel.js';

const DEFAULT_COMPONENT_PARTS: Record<string, string[]> = {
  'nui-button': ['button', 'label', 'icon', 'loading-icon', 'badge', 'media'],
  'nui-input-text': ['input'],
  'nui-input-otp': ['root', 'input'],
  'nui-textarea': ['textarea'],
  'nui-password': ['root', 'input', 'toggle-button', 'overlay'],
  'nui-select': ['root', 'trigger', 'label', 'arrow', 'panel'],
  'nui-select-button': ['root', 'option', 'icon', 'label'],
  'nui-checkbox': ['root', 'input', 'box'],
  'nui-radio-button': ['root', 'input', 'box', 'icon'],
  'nui-card': [
    'card',
    'header',
    'body',
    'caption',
    'title',
    'subtitle',
    'content',
    'footer',
  ],
  'nui-badge': ['badge'],
  'nui-tag': ['tag', 'icon', 'label'],
  'nui-logo': ['container', 'svg'],
  'nui-float-label': ['root'],
  'nui-tabs': ['root', 'tablist', 'tab', 'tabpanels', 'panel'],
  'nui-dialog': [
    'dialog',
    'panel',
    'header',
    'title',
    'close-button',
    'content',
    'footer',
  ],
  'nui-popover': ['root', 'target', 'panel'],
  'nui-tooltip': ['tooltip', 'arrow'],
  'nui-scroll-panel': ['container', 'content', 'bar', 'handle'],
  'nui-date-picker': [
    'root',
    'input',
    'panel',
    'header',
    'prev-button',
    'next-button',
    'table',
    'day',
  ],
  'nui-color-picker': ['root', 'preview', 'panel'],
  'nui-accordion': ['root', 'tab', 'header', 'content'],
};

export function renderWorkspace(
  definition: PlaygroundDefinition,
  props: PlaygroundProps,
  onPropChange: (key: string, value: string | boolean) => void,
  onReset: () => void,
  isResetDisabled = false,
): TemplateResult {
  const previewClass = definition.getPreviewClass?.(props) ?? '';
  const preview = definition.renderPreview(props, { onPropChange });
  const usageCode = definition.formatUsage(props);
  const parts = definition.parts ?? DEFAULT_COMPONENT_PARTS[definition.tag];

  const handleCopyCode = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(usageCode).catch(() => {});
    }
    window.dispatchEvent(
      new CustomEvent('nui-toast-add', {
        detail: {
          severity: 'success',
          summary: 'Copied',
          detail: 'Copied component code to clipboard!',
          life: 2000,
        },
      }),
    );
  };

  return html`
    <div class="preview-panel">
      <div class="panel-header">
        <nui-heading
          class="playground-panel-title"
          tag="2"
          text=${definition.label}
          unstyled
        ></nui-heading>
        <nui-button
          class="reset-button"
          label="Reset attributes"
          severity="secondary"
          outlined
          size="small"
          ?disabled=${isResetDisabled}
          @click=${onReset}
        ></nui-button>
      </div>
      ${
        definition.description
          ? html`<p class="description">${definition.description}</p>`
          : nothing
      }
      <div class="preview-box ${previewClass}">${preview}</div>
      ${renderPropsPanel(definition.controls, props, onPropChange)}
      <div class="usage-container">
        <div class="usage-header">
          <span class="usage-title">HTML Usage</span>
          <nui-button
            class="usage-copy-button"
            label="Copy code"
            icon="mdi:content-copy"
            size="small"
            severity="secondary"
            outlined
            @click=${handleCopyCode}
          ></nui-button>
        </div>
        <div class="usage">${usageCode}</div>
      </div>
      ${
        parts && parts.length > 0
          ? html`
              <div class="css-parts-container">
                <div class="css-parts-header">
                  <span class="css-parts-title">CSS Shadow Parts</span>
                  <span class="css-parts-hint">Click part to copy <code>::part(...)</code> selector</span>
                </div>
                <div class="css-parts-list">
                  ${parts.map(
                    (part) => html`
                      <button
                        type="button"
                        class="css-part-tag"
                        title="Click to copy ::part(${part})"
                        @click=${() => {
                          if (navigator?.clipboard?.writeText) {
                            navigator.clipboard
                              .writeText(`::part(${part})`)
                              .catch(() => {});
                          }
                          window.dispatchEvent(
                            new CustomEvent('nui-toast-add', {
                              detail: {
                                severity: 'info',
                                summary: 'Copied',
                                detail: `Copied ::part(${part}) selector`,
                                life: 1500,
                              },
                            }),
                          );
                        }}
                      >
                        ::part(${part})
                      </button>
                    `,
                  )}
                </div>
              </div>
            `
          : nothing
      }
    </div>
  `;
}
