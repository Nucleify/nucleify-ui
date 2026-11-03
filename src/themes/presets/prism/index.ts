import { violet } from '../../palettes/index.js';
import type { Preset } from '../../types/preset.js';
/**
 * Prism theme preset.
 *
 * Integrates with the optional peer dependency `nui-rainbow`.
 * When `nui-rainbow` is installed (`npm i nui-rainbow`), it provides animated real-time
 * chromatic rainbow spectrum hue cycling. If `nui-rainbow` is not installed, it gracefully
 * falls back to static spectrum tones.
 */
export const prism: Preset = {
  name: 'prism',
  tokens: {
    primitive: {
      borderRadius: {
        none: '0px',
        '2xs': '3px',
        xs: '5px',
        sm: '8px',
        md: '10px',
        lg: '16px',
        xl: '22px',
        full: '9999px',
      },
      transitions: {
        fast: '0.15s',
        medium: '0.25s',
        slow: '0.35s',
      },
    },
    semantic: {
      primary: violet,
      colorScheme: {
        light: {
          primary: {
            color: 'var(--nui-rainbow-color, #d946ef)',
            hoverColor:
              'color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 88%, black)',
            focusColor:
              'color-mix(in srgb, var(--nui-rainbow-color, rgb(217 70 239)) 40%, transparent)',
            secondaryColor:
              'color-mix(in srgb, var(--nui-rainbow-color, rgb(217 70 239)) 20%, transparent)',
            selectedColor:
              'color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 22%, transparent)',
            highlightColor:
              'color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 14%, transparent)',
            colorDarker:
              'color-mix(in srgb, var(--nui-rainbow-color, #a21caf) 76%, black)',
            contrastColor: '#ffffff',
            borderColor: 'var(--nui-rainbow-color, #f0abfc)',
          },
          surface: {
            background:
              'color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 12%, white)',
            cardBackground:
              'color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 4%, white)',
            contentBackground:
              'color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 7%, white)',
            border:
              'color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 45%, transparent)',
            boxShadow:
              '0 10px 30px -6px color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 40%, transparent), 0 2px 6px color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 18%, transparent)',
            darkText: '#09090b',
            primaryText: '#18181b',
            secondaryText: '#71717a',
            whiteText: '#09090b',
          },
          secondary: {
            color: '#f4f4f5',
            hoverColor: '#e4e4e7',
            activeColor: '#d4d4d8',
            onColor: '#18181b',
            borderColor: '#e4e4e7',
            highlightColor: '#fafafa',
          },
          contrast: {
            color: '#18181b',
            hoverColor: '#09090b',
            textColor: '#ffffff',
            highlightColor: 'rgba(24, 24, 27, 0.08)',
          },
        },
        dark: {
          primary: {
            color: 'var(--nui-rainbow-color, #e879f9)',
            hoverColor:
              'color-mix(in srgb, var(--nui-rainbow-color, #e879f9) 88%, white)',
            focusColor:
              'color-mix(in srgb, var(--nui-rainbow-color, rgb(232 121 249)) 50%, transparent)',
            secondaryColor:
              'color-mix(in srgb, var(--nui-rainbow-color, rgb(232 121 249)) 25%, transparent)',
            selectedColor:
              'color-mix(in srgb, var(--nui-rainbow-color, rgb(232 121 249)) 18%, transparent)',
            highlightColor:
              'color-mix(in srgb, var(--nui-rainbow-color, rgb(232 121 249)) 10%, transparent)',
            colorDarker:
              'color-mix(in srgb, var(--nui-rainbow-color, #c026d3) 80%, black)',
            contrastColor: '#09090b',
            borderColor: 'var(--nui-rainbow-color, #c026d3)',
          },
          surface: {
            background:
              'color-mix(in srgb, var(--nui-rainbow-color, #e879f9) 4%, #040507)',
            cardBackground:
              'color-mix(in srgb, var(--nui-rainbow-color, #e879f9) 6%, #0a0c12)',
            contentBackground:
              'color-mix(in srgb, var(--nui-rainbow-color, #e879f9) 8%, #0f121a)',
            border:
              'color-mix(in srgb, var(--nui-rainbow-color, #e879f9) 20%, rgba(255, 255, 255, 0.08))',
            boxShadow:
              '0 14px 40px -8px rgba(0, 0, 0, 0.85), 0 0 16px -2px color-mix(in srgb, var(--nui-rainbow-color, #e879f9) 18%, transparent)',
            darkText: '#fafafa',
            primaryText: '#f4f4f5',
            secondaryText: '#a1a1aa',
            whiteText: '#ffffff',
          },
          secondary: {
            color: '#18181b',
            hoverColor: '#27272a',
            activeColor: '#3f3f46',
            onColor: '#fafafa',
            borderColor: '#27272a',
            highlightColor: 'rgba(255, 255, 255, 0.06)',
          },
          contrast: {
            color: '#ffffff',
            hoverColor: '#f4f4f5',
            textColor: '#09090b',
            highlightColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  },
};

export default prism;
