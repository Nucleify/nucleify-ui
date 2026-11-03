import '../../components/nui-button/nui-button.js';
import '../../components/nui-logo/nui-logo.js';
import '../../components/nui-select/nui-select.js';
import { html, type TemplateResult } from 'lit';
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
          <img
            class="header-logo"
            src="/logo.svg"
            alt="Nucleify UI Logo"
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
        <span>Mode</span>
        <nui-select
          class="mode-select"
          .options=${[
            { label: 'Dark', value: 'dark' },
            { label: 'Light', value: 'light' },
          ]}
          .value=${mode}
          @nui-change=${(event: CustomEvent<{ value: ThemeMode }>) =>
            onModeChange(event.detail.value)}
        ></nui-select>
      </div>
    </div>
  `;
}
