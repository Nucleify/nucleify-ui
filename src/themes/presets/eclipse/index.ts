import { neutral } from '../../palettes/index.js';
import type { Preset } from '../../types/preset.js';

export const eclipse: Preset = {
  name: 'eclipse',
  tokens: {
    primitive: {
      borderRadius: {
        none: '0px',
        '2xs': '2px',
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      transitions: {
        fast: '0.12s',
        medium: '0.2s',
        slow: '0.3s',
      },
    },
    semantic: {
      primary: neutral,
      colorScheme: {
        light: {
          primary: {
            color: '#171717',
            hoverColor: '#0a0a0a',
            focusColor: 'rgba(23, 23, 23, 0.5)',
            secondaryColor: 'rgba(23, 23, 23, 0.2)',
            selectedColor: 'rgba(23, 23, 23, 0.15)',
            highlightColor: 'rgba(23, 23, 23, 0.1)',
            colorDarker: '#000000',
            contrastColor: '#ffffff',
            borderColor: '#a1a1aa',
          },
          surface: {
            background: '#f4f4f5',
            cardBackground: '#ffffff',
            contentBackground: '#fafafa',
            border: '#8b8b96',
            boxShadow:
              '0 4px 18px -4px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
            darkText: '#0a0a0a',
            primaryText: '#18181b',
            secondaryText: '#71717a',
            whiteText: '#0a0a0a',
          },
          secondary: {
            color: '#e4e4e7',
            hoverColor: '#d4d4d8',
            activeColor: '#a1a1aa',
            onColor: '#3f3f46',
            borderColor: '#71717a',
            highlightColor: '#f4f4f5',
          },
          contrast: {
            color: '#000000',
            hoverColor: '#171717',
            textColor: '#ffffff',
            highlightColor: 'rgba(0, 0, 0, 0.08)',
          },
        },
        dark: {
          primary: {
            color: '#fafafa',
            hoverColor: '#e4e4e7',
            focusColor: 'rgba(250, 250, 250, 0.5)',
            secondaryColor: 'rgba(250, 250, 250, 0.2)',
            selectedColor: 'rgba(250, 250, 250, 0.15)',
            highlightColor: 'rgba(250, 250, 250, 0.1)',
            colorDarker: '#d4d4d8',
            contrastColor: '#09090b',
            borderColor: '#3f3f46',
          },
          surface: {
            background: '#030303',
            cardBackground: '#080808',
            contentBackground: '#0c0c0c',
            border: 'rgba(255, 255, 255, 0.32)',
            boxShadow:
              '0 8px 30px -4px rgba(0, 0, 0, 0.55), 0 4px 6px -1px rgb(0 0 0 / 0.55)',
            darkText: '#fafafa',
            primaryText: '#f4f4f5',
            secondaryText: '#a1a1aa',
            whiteText: '#f8fafc',
          },
          secondary: {
            color: '#111111',
            hoverColor: '#181818',
            activeColor: '#222222',
            onColor: '#fafafa',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            highlightColor: 'rgba(255, 255, 255, 0.06)',
          },
          contrast: {
            color: '#ffffff',
            hoverColor: '#e4e4e7',
            textColor: '#000000',
            highlightColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
  },
};

export default eclipse;
