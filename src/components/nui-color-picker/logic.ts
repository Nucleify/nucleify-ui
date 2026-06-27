import { html, nothing, type TemplateResult } from 'lit';
import type { NuiType } from '../../types/nui-type.js';
import { hsbToCssColor, normalizeHsb } from './color-math.js';
import type { ColorFormat, ColorHsb } from './types.js';

export interface NuiColorPickerViewState {
  format: ColorFormat;
  inline: boolean;
  disabled: boolean;
  invalid: boolean;
  name: string;
  inputId: string;
  tabindex: number;
  colorPickerClass: string;
  nuiType: NuiType;
  overlayVisible: boolean;
  hsb: ColorHsb;
  hiddenValue: string;
  previewColor: string;
}

export interface ColorPickerRenderHandlers {
  onPreviewClick: (event: Event) => void;
  onPreviewKeyDown: (event: KeyboardEvent) => void;
}

export function getColorPickerClass(colorPickerClass: string): string {
  return ['nui-color-picker', colorPickerClass].filter(Boolean).join(' ');
}

function renderPanel(state: NuiColorPickerViewState): TemplateResult {
  const hsb = normalizeHsb(state.hsb);
  const hue = Math.round(hsb.h);
  const saturation = hsb.s;
  const brightness = hsb.b;

  return html`
    <div
      class="nui-color-picker-panel"
      ?hidden=${!state.inline && !state.overlayVisible}
    >
      <div class="nui-color-picker-selector">
        <div
          class="nui-color-picker-color"
          style=${`--nui-color-picker-hue:${hue}`}
        >
          <span
            class="nui-color-picker-handle"
            style=${`left:${saturation}%;top:${100 - brightness}%`}
          ></span>
        </div>
        <div class="nui-color-picker-hue">
          <span
            class="nui-color-picker-hue-handle"
            style=${`top:${(hue / 360) * 100}%`}
          ></span>
        </div>
      </div>
    </div>
  `;
}

export function renderColorPicker(
  state: NuiColorPickerViewState,
  handlers: ColorPickerRenderHandlers,
): TemplateResult {
  const showPreview = !state.inline;

  return html`
    <div
      class=${getColorPickerClass(state.colorPickerClass)}
      nui-type=${state.nuiType || nothing}
      ?inline=${state.inline || nothing}
    >
      ${
        showPreview
          ? html`
              <button
                id=${state.inputId || nothing}
                class="nui-color-picker-preview"
                type="button"
                style=${`background:${state.previewColor}`}
                tabindex=${state.tabindex}
                ?disabled=${state.disabled || nothing}
                aria-haspopup="dialog"
                aria-expanded=${state.overlayVisible ? 'true' : 'false'}
                @click=${handlers.onPreviewClick}
                @keydown=${handlers.onPreviewKeyDown}
              ></button>
            `
          : nothing
      }
      ${renderPanel(state)}
      ${
        state.name
          ? html`
              <input type="hidden" name=${state.name} .value=${state.hiddenValue} />
            `
          : nothing
      }
    </div>
  `;
}

export function getPreviewColor(hsb: ColorHsb): string {
  return hsbToCssColor(hsb);
}
