import { html, nothing, type TemplateResult } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import type { NuiType } from '../../types/nui-type.js';
import { DEFAULT_LOGO_COMBINED_SVG } from './logo-paths.js';

export interface NuiLogoViewState {
  dimensions: number;
  svg?: string;
  mode?: 'dark' | 'light' | '';
  activeMode?: 'dark' | 'light';
  useSymbol: boolean;
  lighterColorClass: string;
  darkerColorClass: string;
  nuiType: NuiType;
  logoClass: string;
}

const LOGO_LIGHTER_FALLBACK = '#10b981';
const LOGO_DARKER_FALLBACK = '#125148';

export function resolveLogoDimensions(dimensions: number | string): number {
  const parsed = Number(dimensions);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 44;
}

export function getLogoClass(logoClass: string): string {
  return ['nui-logo', logoClass].filter(Boolean).join(' ');
}

export function getLogoStyle(nuiType?: string): string | undefined {
  const type = nuiType?.trim() ?? '';

  if (!type) {
    return undefined;
  }

  const lighter = `var(--${type}-c-s, var(--${type}-c-u, ${LOGO_LIGHTER_FALLBACK}))`;
  const darker = `var(--${type}-d-s, var(--${type}-d-u, ${LOGO_DARKER_FALLBACK}))`;

  return `--logo-lighter-color:${lighter};--logo-darker-color:${darker}`;
}

function applyVariantClasses(
  markup: string,
  lighterClass?: string,
  darkerClass?: string,
): string {
  let result = markup;
  const lighter = lighterClass?.trim();
  const darker = darkerClass?.trim();

  if (darker) {
    result = result.replace(
      /class=(["'])([^"']*\b(?:nui-logo--dark|nui-logo-darker)\b[^"']*)\1/g,
      (_match, quote, existingClasses) => {
        const classes = existingClasses.split(/\s+/).filter(Boolean);
        if (!classes.includes(darker)) {
          classes.push(darker);
        }
        return `class=${quote}${classes.join(' ')}${quote}`;
      },
    );
  }

  if (lighter) {
    result = result.replace(
      /class=(["'])([^"']*\b(?:nui-logo--light|nui-logo-lighter)\b[^"']*)\1/g,
      (_match, quote, existingClasses) => {
        const classes = existingClasses.split(/\s+/).filter(Boolean);
        if (!classes.includes(lighter)) {
          classes.push(lighter);
        }
        return `class=${quote}${classes.join(' ')}${quote}`;
      },
    );
  }

  return result;
}

function prepareCustomSvg(
  svgString: string,
  className: string,
  size: number,
  styleAttr: string,
  typeAttr: string,
): string {
  const content = svgString.trim();

  // If provided as multiple elements or container without single root <svg>
  if (content.includes('<svg')) {
    // Inject size and attributes onto all <svg> tags inside (e.g. for dark/light variants)
    return content.replaceAll(
      /<svg([^>]*)>/g,
      `<svg$1 part="svg" class="${className}" width="${size}" height="${size}"${styleAttr}${typeAttr} aria-hidden="true">`,
    );
  }

  // If provided as inner SVG paths/elements without <svg> tag:
  return `<svg part="svg" class="${className}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"${styleAttr}${typeAttr} aria-hidden="true">${content}</svg>`;
}

function renderInlineLogo(
  state: NuiLogoViewState,
  size: number,
): TemplateResult {
  const className = getLogoClass(state.logoClass);
  const style = getLogoStyle(state.nuiType);
  const styleAttr = style ? ` style="${style}"` : '';
  const typeAttr = state.nuiType ? ` nui-type="${state.nuiType}"` : '';
  const activeMode = state.activeMode || state.mode || 'dark';

  const rawSvg = state.svg?.trim() || DEFAULT_LOGO_COMBINED_SVG;
  const withVariantClasses = applyVariantClasses(
    rawSvg,
    state.lighterColorClass,
    state.darkerColorClass,
  );
  const processedSvg = prepareCustomSvg(
    withVariantClasses,
    className,
    size,
    styleAttr,
    typeAttr,
  );

  return html`
    <div part="container" class="nui-logo-container" mode=${activeMode}>
      ${unsafeSVG(processedSvg)}
    </div>
  `;
}

export function renderLogo(state: NuiLogoViewState): TemplateResult {
  const size = resolveLogoDimensions(state.dimensions);
  const style = getLogoStyle(state.nuiType);
  const className = getLogoClass(state.logoClass);

  if (state.useSymbol) {
    return html`
      <svg
        part="svg"
        class=${className}
        width=${size}
        height=${size}
        style=${style || nothing}
        nui-type=${state.nuiType || nothing}
        aria-hidden="true"
      >
        <use href="#logo-symbol"></use>
      </svg>
    `;
  }

  return renderInlineLogo(state, size);
}
