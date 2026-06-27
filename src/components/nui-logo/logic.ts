import { html, nothing, type TemplateResult } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import type { NuiType } from '../../types/nui-type.js';
import { LOGO_DARKER_PATH, LOGO_LIGHTER_PATH } from './logo-paths.js';

export interface NuiLogoViewState {
  dimensions: number;
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

export function getLogoStyle(nuiType: string): string | undefined {
  const type = nuiType.trim();

  if (!type) {
    return undefined;
  }

  const lighter = `var(--${type}-c-s, var(--${type}-c-u, ${LOGO_LIGHTER_FALLBACK}))`;
  const darker = `var(--${type}-d-s, var(--${type}-d-u, ${LOGO_DARKER_FALLBACK}))`;

  return `--logo-lighter-color:${lighter};--logo-darker-color:${darker}`;
}

function getPathFill(
  varName: string,
  fallback: string,
  themed: boolean,
): string {
  return themed ? `var(${varName}, ${fallback})` : fallback;
}

function renderInlineLogo(
  state: NuiLogoViewState,
  size: number,
): TemplateResult {
  const themed = Boolean(state.nuiType.trim());
  const className = getLogoClass(state.logoClass);
  const style = getLogoStyle(state.nuiType);
  const lighterClass = ['nui-logo-lighter', state.lighterColorClass]
    .filter(Boolean)
    .join(' ');
  const darkerClass = ['nui-logo-darker', state.darkerColorClass]
    .filter(Boolean)
    .join(' ');
  const lighterFill = getPathFill(
    '--logo-lighter-color',
    LOGO_LIGHTER_FALLBACK,
    themed,
  );
  const darkerFill = getPathFill(
    '--logo-darker-color',
    LOGO_DARKER_FALLBACK,
    themed,
  );
  const styleAttr = style ? ` style="${style}"` : '';
  const typeAttr = state.nuiType ? ` nui-type="${state.nuiType}"` : '';

  return html`${unsafeSVG(`
    <svg
      class="${className}"
      width="${size}"
      height="${size}"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2710 3140"${styleAttr}${typeAttr}
      aria-hidden="true"
    >
      <path
        class="${lighterClass}"
        style="fill:${lighterFill}"
        stroke="none"
        fill-rule="evenodd"
        d="${LOGO_LIGHTER_PATH}"
      ></path>
      <path
        class="${darkerClass}"
        style="fill:${darkerFill}"
        stroke="none"
        fill-rule="evenodd"
        d="${LOGO_DARKER_PATH}"
      ></path>
    </svg>
  `)}`;
}

export function renderLogo(state: NuiLogoViewState): TemplateResult {
  const size = resolveLogoDimensions(state.dimensions);
  const style = getLogoStyle(state.nuiType);
  const className = getLogoClass(state.logoClass);

  if (state.useSymbol) {
    return html`
      <svg
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
