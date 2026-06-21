export type Palette = 'nuxt' | 'next';
export type ThemeMode = 'light' | 'dark';

const THEME_CLASSES = [
  'nuc-primary-palette-nuxt',
  'nuc-primary-palette-next',
  'nuc-theme-light-nuxt',
  'nuc-theme-light-next',
  'nuc-theme-dark-nuxt',
  'nuc-theme-dark-next',
] as const;

export function applyTheme(palette: Palette, mode: ThemeMode) {
  document.body.classList.remove(...THEME_CLASSES);
  document.body.classList.add(
    `nuc-primary-palette-${palette}`,
    `nuc-theme-${mode}-${palette}`,
  );
}
