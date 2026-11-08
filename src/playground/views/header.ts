import '../../components/nui-button/nui-button.js';
import '../../components/nui-select/nui-select.js';
import '../../components/nui-select-button/nui-select-button.js';
import { html, type TemplateResult } from 'lit';
import { ref } from 'lit/directives/ref.js';
import type { PresetName, ThemeMode } from '../../themes/index.js';

const PRESETS: { id: PresetName; label: string }[] = [
  { id: 'nucleus', label: 'Nucleus' },
  { id: 'quantum', label: 'Quantum' },
  { id: 'kinetic', label: 'Kinetic' },
  { id: 'cosmos', label: 'Cosmos' },
  { id: 'apex', label: 'Apex' },
  { id: 'eclipse', label: 'Eclipse' },
  { id: 'prism', label: 'Prism' },
  { id: 'abyss', label: 'Abyss' },
];

const MODE_OPTIONS = [
  { label: 'Dark', value: 'dark', icon: 'mdi:weather-night' },
  { label: 'Light', value: 'light', icon: 'mdi:white-balance-sunny' },
];

let modeToggleStyles: CSSStyleSheet | null = null;

function getModeToggleStyles(): CSSStyleSheet {
  if (!modeToggleStyles) {
    modeToggleStyles = new CSSStyleSheet();
    modeToggleStyles.replaceSync(`
      :host {
        display: inline-flex;
      }

      .nui-select-button {
        display: inline-flex;
        width: 100%;
      }

      .nui-select-button-option {
        flex: 1 1 auto;
        height: 2.5625rem;
        gap: 0.4rem;
        margin: 0 0 0 calc(-1 * var(--border-width));
        padding: 0 0.875rem;
        border: var(--border-width) solid var(--nui-card-border);
        border-radius: 0;
        background: var(--nui-card-background);
        color: var(--nui-secondary-text-color);
        font-size: 0.875rem;
        font-weight: var(--font-weight-semibold);
        letter-spacing: 0.01em;
        box-sizing: border-box;
        box-shadow: none;
      }

      .nui-select-button-option:first-child {
        margin-left: 0;
        border-top-left-radius: var(--border-radius-sm);
        border-bottom-left-radius: var(--border-radius-sm);
      }

      .nui-select-button-option:last-child {
        border-top-right-radius: var(--border-radius-sm);
        border-bottom-right-radius: var(--border-radius-sm);
      }

      .nui-select-button .nui-select-button-option:hover:not(:disabled):not([selected]),
      .nui-select-button .nui-select-button-option:hover:not(:disabled):not([selected]):not(:focus):not(:focus-visible) {
        background: color-mix(in srgb, var(--nui-primary-color) 8%, var(--nui-card-background));
        border-color: var(--nui-card-border);
        color: var(--nui-white-text-color);
        z-index: 1;
      }

      .nui-select-button-option[selected] {
        z-index: 2;
        background: color-mix(in srgb, var(--nui-primary-color) 18%, var(--nui-card-background));
        border-color: var(--nui-primary-color);
        color: var(--nui-white-text-color);
        box-shadow: inset 0 0 0 1px var(--nui-primary-selected-color);
      }

      .nui-select-button-option[selected]:hover:not(:disabled) {
        background: color-mix(in srgb, var(--nui-primary-color) 24%, var(--nui-card-background));
        border-color: var(--nui-primary-hover-color);
      }

      .nui-select-button .nui-select-button-option:focus:not(:focus-visible) {
        border-color: var(--nui-card-border);
        box-shadow: none;
      }

      .nui-select-button .nui-select-button-option[selected]:focus:not(:focus-visible) {
        border-color: var(--nui-primary-color);
        box-shadow: inset 0 0 0 1px var(--nui-primary-selected-color);
      }

      .nui-select-button .nui-select-button-option:focus-visible {
        z-index: 3;
      }

      .nui-select-button-icon {
        width: 0.95em;
        height: 0.95em;
      }
    `);
  }

  return modeToggleStyles;
}

function applyModeToggleStyles(el?: Element): void {
  const root = el?.shadowRoot;
  if (!root) {
    return;
  }

  const sheet = getModeToggleStyles();
  if (!root.adoptedStyleSheets.includes(sheet)) {
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
  }
}

export function renderHeader(
  preset: PresetName,
  mode: ThemeMode,
  onPresetChange: (preset: PresetName) => void,
  onModeChange: (mode: ThemeMode) => void,
  onMenuToggle: () => void,
): TemplateResult {
  return html`
    <header>
      <div class="header-top">
        <div class="header-brand">
          <a
            class="header-brand-link"
            href="https://ui.nucleify.io"
            aria-label="Nucleify UI"
          >
            <img
              class="header-logo site-logo site-logo--dark${mode === 'light' ? ' is-hidden' : ''}"
              src="/logo-transparent.webp"
              alt="Nucleify UI"
              width="32"
              height="32"
            />
            <img
              class="header-logo site-logo site-logo--light${mode === 'light' ? '' : ' is-hidden'}"
              src="/logo-transparent-light.webp"
              alt="Nucleify UI"
              width="32"
              height="32"
            />
            <div class="header-intro">
              <nui-heading
                class="playground-site-title"
                tag="1"
                text="Nucleify UI"
                unstyled
              ></nui-heading>
            </div>
          </a>
          <button
            class="menu-button"
            type="button"
            aria-label="Toggle navigation menu"
            @click=${onMenuToggle}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
        ${renderThemeControls(preset, mode, onPresetChange, onModeChange)}
      </div>
    </header>
  `;
}

function renderThemeControls(
  preset: PresetName,
  mode: ThemeMode,
  onPresetChange: (preset: PresetName) => void,
  onModeChange: (mode: ThemeMode) => void,
): TemplateResult {
  return html`
    <div class="theme-controls">
      <div class="control-group control-group--preset">
        <span>Theme</span>
        <nui-select
          class="preset-select"
          .options=${PRESETS.map((p) => ({ label: p.label, value: p.id }))}
          .value=${preset}
          @nui-change=${(event: CustomEvent<{ value: PresetName }>) =>
            onPresetChange(event.detail.value)}
        ></nui-select>
      </div>
      <div class="control-group control-group--mode">
        <nui-select-button
          ${ref(applyModeToggleStyles)}
          class="mode-toggle"
          aria-label="Color mode"
          option-icon="icon"
          .allowEmpty=${false}
          .options=${MODE_OPTIONS}
          .value=${mode}
          @change=${(event: CustomEvent<{ value: ThemeMode }>) =>
            onModeChange(event.detail.value)}
        ></nui-select-button>
      </div>
    </div>
  `;
}
