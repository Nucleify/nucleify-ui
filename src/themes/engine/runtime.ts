import type { Preset, ThemeMode, ThemeOptions } from '../types/preset.js';
import { compilePresetToCss } from './compiler.js';

let currentPreset: Preset | undefined;
let currentOptions: ThemeOptions = {
  mode: 'dark',
  darkModeSelector: '.nui-dark',
};
let rainbowUnbind: (() => void) | undefined;
let rainbowTarget: HTMLElement | undefined;
let rainbowPending = false;

type RainbowModule = { applyRainbow?: (target: HTMLElement) => () => void };
type RainbowLoader = () => Promise<RainbowModule>;

const defaultRainbowLoader: RainbowLoader = () => {
  const rainbowPackage = 'nui-rainbow';
  return import(/* @vite-ignore */ rainbowPackage);
};
let rainbowLoader: RainbowLoader = defaultRainbowLoader;

/**
 * Registers how the optional `nui-rainbow` package is loaded for the prism preset.
 * Apps whose dev server/bundler cannot resolve the dynamic default import should pass
 * a literal import: `registerRainbowLoader(() => import('nui-rainbow'))`.
 *
 * @param loader Function resolving to the `nui-rainbow` module
 */
export function registerRainbowLoader(loader: RainbowLoader): void {
  rainbowLoader = loader;
}

const THEME_STYLE_ID = 'nui-theme-variables';

function getTargetElement(options?: ThemeOptions): HTMLElement | null {
  if (typeof document === 'undefined') {
    return null;
  }
  if (options?.target) {
    return options.target instanceof Document
      ? document.documentElement
      : options.target;
  }
  return document.body ?? document.documentElement;
}

function updatePresetClass(target: HTMLElement, presetName?: string): void {
  const classesToRemove: string[] = [];
  target.classList.forEach((cls) => {
    if (cls.startsWith('nui-preset-')) {
      classesToRemove.push(cls);
    }
  });
  if (classesToRemove.length > 0) {
    target.classList.remove(...classesToRemove);
  }

  if (presetName) {
    target.classList.add(`nui-preset-${presetName}`);
  }
}

function updateThemeClasses(mode: ThemeMode, options?: ThemeOptions): void {
  const target = getTargetElement(options);
  if (!target) {
    return;
  }

  const darkSelector = options?.darkModeSelector ?? '.nui-dark';
  const cleanDarkClassName = darkSelector.replace(/^\./, '');

  if (mode === 'dark') {
    target.classList.add(cleanDarkClassName);
    target.classList.remove('nui-light');
  } else {
    target.classList.remove(cleanDarkClassName);
    target.classList.add('nui-light');
  }
}

/**
 * Applies a theme preset globally.
 * Injects CSS variables and applies theme mode classes.
 *
 * @param preset The Preset to apply
 * @param options Mode and selector options
 */
export function applyPreset(preset: Preset, options?: ThemeOptions): void {
  currentPreset = preset;
  currentOptions = {
    ...currentOptions,
    ...options,
  };

  const mode = currentOptions.mode ?? 'dark';

  if (typeof document !== 'undefined') {
    const css = compilePresetToCss(preset, currentOptions);

    let styleEl = document.getElementById(
      THEME_STYLE_ID,
    ) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = THEME_STYLE_ID;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;

    const target = getTargetElement(currentOptions);
    if (target) {
      updatePresetClass(target, preset.name);

      const keepRainbow =
        preset.name === 'prism' &&
        rainbowTarget === target &&
        (rainbowUnbind !== undefined || rainbowPending);

      if (!keepRainbow) {
        if (rainbowUnbind) {
          rainbowUnbind();
          rainbowUnbind = undefined;
        }
        rainbowTarget = undefined;
        target.style.removeProperty('--nui-rainbow-lightness');
        target.style.removeProperty('--nui-rainbow-saturation');
      }

      if (preset.name === 'prism') {
        // High saturation and balanced lightness so all hues (especially greens and cyans)
        // are rich, punchy, and vibrant rather than pale or washed out.
        if (mode === 'light') {
          target.style.setProperty('--nui-rainbow-lightness', '42%');
          target.style.setProperty('--nui-rainbow-saturation', '80%');
        } else {
          target.style.setProperty('--nui-rainbow-lightness', '50%');
          target.style.setProperty('--nui-rainbow-saturation', '85%');
        }

        if (!keepRainbow) {
          rainbowTarget = target;
          rainbowPending = true;
          rainbowLoader()
            .then((nuiRainbow) => {
              if (
                currentPreset?.name === 'prism' &&
                rainbowTarget === target &&
                typeof nuiRainbow.applyRainbow === 'function'
              ) {
                rainbowUnbind = nuiRainbow.applyRainbow(target);
              }
            })
            .catch(() => {
              // nui-rainbow is an optional peer dependency.
              // If not installed, prism cleanly falls back to its CSS variable defaults.
            })
            .finally(() => {
              rainbowPending = false;
            });
        }
      }
    }
    updateThemeClasses(mode, currentOptions);
  }
}

/**
 * Changes the current theme mode ('light' | 'dark').
 *
 * @param mode The desired ThemeMode
 */
export function setThemeMode(mode: ThemeMode): void {
  currentOptions.mode = mode;
  if (currentPreset) {
    applyPreset(currentPreset, currentOptions);
  } else {
    updateThemeClasses(mode, currentOptions);
  }
}

/**
 * Returns the currently active Preset.
 */
export function getActivePreset(): Preset | undefined {
  return currentPreset;
}

/**
 * Returns the currently active ThemeMode.
 */
export function getActiveThemeMode(): ThemeMode {
  return currentOptions.mode ?? 'dark';
}
