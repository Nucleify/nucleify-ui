export type Palette = 'nuxt' | 'next';
export type ThemeMode = 'light' | 'dark';

const THEME_CLASSES = [
  'nui-primary-palette-nuxt',
  'nui-primary-palette-next',
  'nui-theme-light-nuxt',
  'nui-theme-light-next',
  'nui-theme-dark-nuxt',
  'nui-theme-dark-next',
] as const;

export function applyTheme(palette: Palette, mode: ThemeMode) {
  document.body.classList.remove(...THEME_CLASSES);
  document.body.classList.add(
    `nui-primary-palette-${palette}`,
    `nui-theme-${mode}-${palette}`,
  );
}
