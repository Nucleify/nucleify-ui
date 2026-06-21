import { html, type TemplateResult } from 'lit';
import type { Palette, ThemeMode } from '../../theme.js';

export function renderHeader(
  palette: Palette,
  mode: ThemeMode,
  onPaletteChange: (palette: Palette) => void,
  onModeChange: (mode: ThemeMode) => void,
): TemplateResult {
  return html`
    <header>
      <div class="header-top">
        <div>
          <h1>Nucleify UI Playground</h1>
          <p>Test Lit components – register new ones in src/playground/registry.ts</p>
        </div>
        ${renderThemeControls(palette, mode, onPaletteChange, onModeChange)}
      </div>
    </header>
  `;
}

function renderThemeControls(
  palette: Palette,
  mode: ThemeMode,
  onPaletteChange: (palette: Palette) => void,
  onModeChange: (mode: ThemeMode) => void,
): TemplateResult {
  return html`
    <div class="theme-controls">
      <div class="control-group">
        <span>Palette</span>
        <button
          aria-pressed=${palette === 'nuxt' ? 'true' : 'false'}
          @click=${() => onPaletteChange('nuxt')}
        >
          Nuxt
        </button>
        <button
          aria-pressed=${palette === 'next' ? 'true' : 'false'}
          @click=${() => onPaletteChange('next')}
        >
          Next
        </button>
      </div>
      <div class="control-group">
        <span>Theme</span>
        <button
          aria-pressed=${mode === 'light' ? 'true' : 'false'}
          @click=${() => onModeChange('light')}
        >
          Light
        </button>
        <button
          aria-pressed=${mode === 'dark' ? 'true' : 'false'}
          @click=${() => onModeChange('dark')}
        >
          Dark
        </button>
      </div>
    </div>
  `;
}
