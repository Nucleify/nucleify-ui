import { beforeEach, describe, expect, it } from 'vitest';
import {
  abyss,
  apex,
  applyPreset,
  compilePresetToCss,
  cosmos,
  definePreset,
  eclipse,
  getActivePreset,
  getActiveThemeMode,
  kinetic,
  nucleus,
  prism,
  quantum,
  setThemeMode,
} from '../src/themes/index.js';

describe('Themes Engine & Presets', () => {
  beforeEach(() => {
    document.body.className = '';
    const styleEl = document.getElementById('nui-theme-variables');
    if (styleEl) {
      styleEl.remove();
    }
  });

  describe('Built-in Presets', () => {
    const presets = [
      { name: 'nucleus', preset: nucleus },
      { name: 'quantum', preset: quantum },
      { name: 'kinetic', preset: kinetic },
      { name: 'cosmos', preset: cosmos },
      { name: 'apex', preset: apex },
      { name: 'eclipse', preset: eclipse },
      { name: 'prism', preset: prism },
      { name: 'abyss', preset: abyss },
    ];

    it.each(presets)('$name preset compiles to valid CSS', ({
      name,
      preset,
    }) => {
      expect(preset.name).toBe(name);
      expect(preset.tokens).toBeDefined();

      const css = compilePresetToCss(preset);
      expect(css).toContain(':root');
      expect(css).toContain('.nui-dark');
      expect(css).toContain('--nui-primary-color');
      expect(css).toContain('--border-radius-sm');
    });
  });

  describe('definePreset', () => {
    it('extends an existing preset with custom overrides', () => {
      const myCustomPreset = definePreset(nucleus, {
        name: 'custom',
        tokens: {
          semantic: {
            colorScheme: {
              light: {
                primary: {
                  color: '#ff0000',
                },
              },
            },
          },
        },
      });

      expect(myCustomPreset.name).toBe('custom');
      expect(
        myCustomPreset.tokens.semantic.colorScheme.light.primary.color,
      ).toBe('#ff0000');
      // Inherits other properties from nucleus
      expect(myCustomPreset.tokens.primitive.borderRadius.sm).toBe(
        nucleus.tokens.primitive.borderRadius.sm,
      );
      expect(
        myCustomPreset.tokens.semantic.colorScheme.dark.primary.color,
      ).toBe(nucleus.tokens.semantic.colorScheme.dark.primary.color);
    });
  });

  describe('applyPreset and setThemeMode runtime', () => {
    it('applies preset stylesheet and sets body classes', () => {
      applyPreset(quantum, { mode: 'dark' });

      expect(getActivePreset()).toBe(quantum);
      expect(getActiveThemeMode()).toBe('dark');
      expect(document.body.classList.contains('nui-dark')).toBe(true);
      expect(document.body.classList.contains('nui-preset-quantum')).toBe(true);

      const styleEl = document.getElementById('nui-theme-variables');
      expect(styleEl).not.toBeNull();
      expect(styleEl?.textContent).toContain('--nui-primary-color');
    });

    it('switches theme mode dynamically with setThemeMode', () => {
      applyPreset(abyss, { mode: 'light' });

      expect(getActiveThemeMode()).toBe('light');
      expect(document.body.classList.contains('nui-light')).toBe(true);
      expect(document.body.classList.contains('nui-dark')).toBe(false);

      setThemeMode('dark');

      expect(getActiveThemeMode()).toBe('dark');
      expect(document.body.classList.contains('nui-dark')).toBe(true);
      expect(document.body.classList.contains('nui-light')).toBe(false);
    });

    it('switches between presets cleanly', () => {
      applyPreset(kinetic, { mode: 'dark' });
      expect(document.body.classList.contains('nui-preset-kinetic')).toBe(true);

      applyPreset(apex, { mode: 'dark' });
      expect(document.body.classList.contains('nui-preset-kinetic')).toBe(
        false,
      );
      expect(document.body.classList.contains('nui-preset-apex')).toBe(true);
    });
  });
});
