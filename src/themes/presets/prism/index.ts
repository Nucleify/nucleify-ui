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
              'color-mix(in srgb, var(--nui-rainbow-color, rgb(217 70 239)) 50%, transparent)',
            secondaryColor:
              'color-mix(in srgb, var(--nui-rainbow-color, rgb(217 70 239)) 20%, transparent)',
            selectedColor:
              'color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 15%, transparent)',
            highlightColor:
              'color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 10%, transparent)',
            colorDarker:
              'color-mix(in srgb, var(--nui-rainbow-color, #a21caf) 76%, black)',
            contrastColor: '#ffffff',
            borderColor:
              'color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 45%, white)',
          },
          surface: {
            background:
              'color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 8%, white)',
            cardBackground: '#ffffff',
            contentBackground:
              'color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 4%, white)',
            border:
              'color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 45%, #64748b)',
            boxShadow:
              '0 4px 18px -4px color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 22%, transparent), 0 1px 3px color-mix(in srgb, var(--nui-rainbow-color, #d946ef) 12%, transparent)',
            darkText: '#09090b',
            primaryText: '#18181b',
            secondaryText: '#71717a',
            whiteText: '#09090b',
          },
          secondary: {
            color: '#e4e4e7',
            hoverColor: '#d4d4d8',
            activeColor: '#a1a1aa',
            onColor: '#3f3f46',
            borderColor: '#64748b',
            highlightColor: '#f4f4f5',
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
              'color-mix(in srgb, var(--nui-rainbow-color, rgb(232 121 249)) 20%, transparent)',
            selectedColor:
              'color-mix(in srgb, var(--nui-rainbow-color, rgb(232 121 249)) 15%, transparent)',
            highlightColor:
              'color-mix(in srgb, var(--nui-rainbow-color, rgb(232 121 249)) 10%, transparent)',
            colorDarker:
              'color-mix(in srgb, var(--nui-rainbow-color, #c026d3) 80%, black)',
            contrastColor: '#09090b',
            borderColor:
              'color-mix(in srgb, var(--nui-rainbow-color, #c026d3) 70%, black)',
          },
          surface: {
            background:
              'color-mix(in srgb, var(--nui-rainbow-color, #e879f9) 3%, #03050c)',
            cardBackground:
              'color-mix(in srgb, var(--nui-rainbow-color, #e879f9) 4%, #05080f)',
            contentBackground:
              'color-mix(in srgb, var(--nui-rainbow-color, #e879f9) 5%, #070a12)',
            border:
              'color-mix(in srgb, var(--nui-rainbow-color, #f0abfc) 34%, transparent)',
            boxShadow:
              '0 8px 30px -4px color-mix(in srgb, var(--nui-rainbow-color, #e879f9) 12%, transparent), 0 4px 6px -1px rgb(0 0 0 / 0.55)',
            darkText: '#fafafa',
            primaryText: '#f4f4f5',
            secondaryText: '#a1a1aa',
            whiteText: '#f8fafc',
          },
          secondary: {
            color: '#0c0c10',
            hoverColor: '#14141a',
            activeColor: '#1c1c24',
            onColor: '#fafafa',
            borderColor:
              'color-mix(in srgb, var(--nui-rainbow-color, #f0abfc) 40%, transparent)',
            highlightColor:
              'color-mix(in srgb, var(--nui-rainbow-color, #e879f9) 6%, transparent)',
          },
          contrast: {
            color: '#ffffff',
            hoverColor: '#f4f4f5',
            textColor: '#09090b',
            highlightColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
  },
};

export default prism;
