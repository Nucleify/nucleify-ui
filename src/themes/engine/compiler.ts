import type { Preset, ThemeOptions } from '../types/preset.js';
import type { SemanticColorScheme } from '../types/tokens.js';

function hexToRgb(hex: string): string {
  const sanitized = hex.trim().replace(/^#/, '');
  if (sanitized.length === 3) {
    const r = Number.parseInt(sanitized[0] + sanitized[0], 16);
    const g = Number.parseInt(sanitized[1] + sanitized[1], 16);
    const b = Number.parseInt(sanitized[2] + sanitized[2], 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return `${r}, ${g}, ${b}`;
    }
  } else if (sanitized.length >= 6) {
    const r = Number.parseInt(sanitized.slice(0, 2), 16);
    const g = Number.parseInt(sanitized.slice(2, 4), 16);
    const b = Number.parseInt(sanitized.slice(4, 6), 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return `${r}, ${g}, ${b}`;
    }
  }
  return '16, 185, 129';
}

function renderSchemeVariables(scheme: SemanticColorScheme): string {
  const primaryRgb = hexToRgb(scheme.primary.color);
  const whiteTextRgb = hexToRgb(scheme.surface.whiteText);

  const lines = [
    `--nui-primary-color: ${scheme.primary.color};`,
    `--nui-primary-color-rgb: ${primaryRgb};`,
    `--nui-primary-dark-color: ${scheme.primary.darkColor ?? scheme.primary.hoverColor};`,
    `--nui-primary-hover-color: ${scheme.primary.hoverColor};`,
    `--nui-primary-focus-color: ${scheme.primary.focusColor};`,
    `--nui-primary-secondary-color: ${scheme.primary.secondaryColor};`,
    `--nui-primary-selected-color: ${scheme.primary.selectedColor};`,
    `--nui-primary-highlight-color: ${scheme.primary.highlightColor};`,
    `--nui-primary-color-darker: ${scheme.primary.colorDarker ?? scheme.primary.hoverColor};`,
    `--nui-primary-border-color: ${scheme.primary.borderColor ?? scheme.surface.border};`,
    `--nui-primary-white-text-color: ${scheme.primary.contrastColor ?? scheme.surface.text};`,
    `--nui-primary-white-green-text-color: ${scheme.primary.color};`,
    '--nui-focus-border-color: var(--nui-primary-color);',
    '--nui-focus-box-shadow: 0 0 0.5em var(--nui-primary-focus-color);',

    `--nui-bg-dark-color: ${scheme.surface.background};`,
    `--nui-card-background: ${scheme.surface.cardBackground};`,
    `--nui-card-border: ${scheme.surface.border};`,
    scheme.surface.boxShadow
      ? `--nui-card-box-shadow: ${scheme.surface.boxShadow};`
      : '',
    scheme.surface.backdropBlur
      ? `--nui-card-backdrop-blur: ${scheme.surface.backdropBlur};`
      : '',
    `--nui-content-background: ${scheme.surface.contentBackground};`,
    `--nui-dark-text-color: ${scheme.surface.darkText};`,
    `--nui-primary-text-color: ${scheme.surface.primaryText};`,
    `--nui-secondary-text-color: ${scheme.surface.secondaryText};`,
    `--nui-white-text-color: ${scheme.surface.whiteText};`,
    `--nui-white-text-rgb: ${whiteTextRgb};`,

    `--nui-secondary-color: ${scheme.secondary.color};`,
    `--nui-secondary-hover-color: ${scheme.secondary.hoverColor};`,
    `--nui-secondary-active-color: ${scheme.secondary.activeColor};`,
    `--nui-secondary-on-color: ${scheme.secondary.onColor};`,
    `--nui-secondary-border-color: ${scheme.secondary.borderColor};`,
    `--nui-secondary-highlight-color: ${scheme.secondary.highlightColor};`,

    `--nui-contrast-color: ${scheme.contrast.color};`,
    `--nui-contrast-hover-color: ${scheme.contrast.hoverColor};`,
    `--nui-contrast-text-color: ${scheme.contrast.textColor};`,
    `--nui-contrast-highlight-color: ${scheme.contrast.highlightColor};`,
  ].filter(Boolean);

  return lines.map((line) => `  ${line}`).join('\n');
}

/**
 * Compiles a preset definition into standard CSS rules.
 *
 * @param preset The Preset object to compile
 * @param options Theming and selector options
 * @returns Generated CSS string
 */
export function compilePresetToCss(
  preset: Preset,
  options?: ThemeOptions,
): string {
  const { tokens } = preset;
  const darkSelector = options?.darkModeSelector ?? '.nui-dark';

  const primitiveLines: string[] = [];

  if (tokens.primitive?.borderRadius) {
    const r = tokens.primitive.borderRadius;
    if (r.sm) primitiveLines.push(`  --border-radius-sm: ${r.sm};`);
    if (r.md) primitiveLines.push(`  --border-radius-md: ${r.md};`);
    if (r.lg) primitiveLines.push(`  --border-radius-lg: ${r.lg};`);
    if (r.xl) primitiveLines.push(`  --nui-card-border-radius: ${r.xl};`);
  }

  if (tokens.primitive?.transitions) {
    const t = tokens.primitive.transitions;
    if (t.fast) primitiveLines.push(`  --transition-fast: ${t.fast};`);
    if (t.medium) primitiveLines.push(`  --transition-medium: ${t.medium};`);
    if (t.slow) primitiveLines.push(`  --transition-slow: ${t.slow};`);
  }

  if (tokens.semantic.severity) {
    const s = tokens.semantic.severity;
    if (s.success) {
      primitiveLines.push(`  --nui-success-color: ${s.success.color};`);
      primitiveLines.push(
        `  --nui-success-hover-color: ${s.success.hoverColor};`,
      );
      primitiveLines.push(
        `  --nui-success-highlight-color: ${s.success.highlightColor};`,
      );
    }
    if (s.info) {
      primitiveLines.push(`  --nui-info-color: ${s.info.color};`);
      primitiveLines.push(`  --nui-info-hover-color: ${s.info.hoverColor};`);
      primitiveLines.push(
        `  --nui-info-highlight-color: ${s.info.highlightColor};`,
      );
    }
    if (s.warn) {
      primitiveLines.push(`  --nui-warn-color: ${s.warn.color};`);
      primitiveLines.push(`  --nui-warn-hover-color: ${s.warn.hoverColor};`);
      primitiveLines.push(
        `  --nui-warn-highlight-color: ${s.warn.highlightColor};`,
      );
    }
    if (s.help) {
      primitiveLines.push(`  --nui-help-color: ${s.help.color};`);
      primitiveLines.push(`  --nui-help-hover-color: ${s.help.hoverColor};`);
      primitiveLines.push(
        `  --nui-help-highlight-color: ${s.help.highlightColor};`,
      );
    }
    if (s.danger) {
      primitiveLines.push(`  --nui-danger-color: ${s.danger.color};`);
      primitiveLines.push(
        `  --nui-danger-hover-color: ${s.danger.hoverColor};`,
      );
      primitiveLines.push(
        `  --nui-danger-highlight-color: ${s.danger.highlightColor};`,
      );
      primitiveLines.push(`  --invalid-color: ${s.danger.color};`);
    }
  }

  const primitiveBlock =
    primitiveLines.length > 0 ? `\n${primitiveLines.join('\n')}` : '';
  const lightBlock = renderSchemeVariables(tokens.semantic.colorScheme.light);
  const darkBlock = renderSchemeVariables(tokens.semantic.colorScheme.dark);

  const customCss = preset.css
    ? `\n/* Custom Preset CSS */\n${preset.css}`
    : '';

  return `/* Nucleify UI Theme Preset: ${preset.name} */
:root, .nui-light {
${lightBlock}${primitiveBlock}
}

${darkSelector} {
${darkBlock}
}${customCss}
`;
}
