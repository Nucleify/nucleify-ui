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
            color: '#000000',
            hoverColor: '#262626',
            focusColor: 'rgba(0, 0, 0, 0.35)',
            secondaryColor: 'rgba(0, 0, 0, 0.1)',
            selectedColor: 'rgba(0, 0, 0, 0.08)',
            highlightColor: 'rgba(0, 0, 0, 0.05)',
            colorDarker: '#171717',
            contrastColor: '#ffffff',
            borderColor: '#000000',
          },
          surface: {
            background: '#fafafa',
            cardBackground: '#ffffff',
            contentBackground: '#ffffff',
            border: '#e5e5e5',
            boxShadow:
              '0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.04)',
            darkText: '#0a0a0a',
            primaryText: '#171717',
            secondaryText: '#737373',
            whiteText: '#0a0a0a',
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
            color: '#000000',
            hoverColor: '#171717',
            textColor: '#ffffff',
            highlightColor: 'rgba(0, 0, 0, 0.05)',
          },
        },
        dark: {
          primary: {
            color: '#ffffff',
            hoverColor: '#e5e5e5',
            focusColor: 'rgba(255, 255, 255, 0.4)',
            secondaryColor: 'rgba(255, 255, 255, 0.18)',
            selectedColor: 'rgba(255, 255, 255, 0.12)',
            highlightColor: 'rgba(255, 255, 255, 0.06)',
            colorDarker: '#d4d4d4',
            contrastColor: '#000000',
            borderColor: '#ffffff',
          },
          surface: {
            background: '#000000',
            cardBackground: '#0a0a0a',
            contentBackground: '#141414',
            border: '#262626',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 0 0 1px #262626',
            darkText: '#ffffff',
            primaryText: '#fafafa',
            secondaryText: '#a3a3a3',
            whiteText: '#ffffff',
          },
          secondary: {
            color: '#171717',
            hoverColor: '#262626',
            activeColor: '#404040',
            onColor: '#ffffff',
            borderColor: '#404040',
            highlightColor: 'rgba(255, 255, 255, 0.05)',
          },
          contrast: {
            color: '#ffffff',
            hoverColor: '#e5e5e5',
            textColor: '#000000',
            highlightColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  },
};

export default eclipse;
