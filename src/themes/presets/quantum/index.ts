import { emerald } from '../../palettes/index.js';
import type { Preset } from '../../types/preset.js';

export const quantum: Preset = {
  name: 'quantum',
  tokens: {
    primitive: {
      borderRadius: {
        none: '0px',
        '2xs': '4px',
        xs: '6px',
        sm: '8px',
        md: '12px',
        lg: '18px',
        xl: '24px',
        full: '9999px',
      },
      transitions: {
        fast: '0.18s',
        medium: '0.3s',
        slow: '0.45s',
      },
    },
    semantic: {
      primary: emerald,
      colorScheme: {
        light: {
          primary: {
            color: '#10b981',
            hoverColor: '#059669',
            focusColor: 'rgba(16, 185, 129, 0.45)',
            secondaryColor: 'rgba(16, 185, 129, 0.2)',
            selectedColor: 'rgba(16, 185, 129, 0.15)',
            highlightColor: 'rgba(16, 185, 129, 0.1)',
            colorDarker: '#047857',
            contrastColor: '#ffffff',
            borderColor: '#a7f3d0',
          },
          surface: {
            background: '#ecfdf5',
            cardBackground: 'rgba(255, 255, 255, 0.85)',
            contentBackground: 'rgba(240, 253, 250, 0.95)',
            border: 'rgba(110, 231, 183, 0.7)',
            boxShadow:
              '0 12px 28px -8px rgba(16, 185, 129, 0.25), 0 2px 6px rgba(16, 185, 129, 0.1)',
            backdropBlur: '14px',
            darkText: '#09090b',
            primaryText: '#18181b',
            secondaryText: '#71717a',
            whiteText: '#09090b',
          },
          secondary: {
            color: '#f4f4f5',
            hoverColor: '#e4e4e7',
            activeColor: '#d4d4d8',
            onColor: '#3f3f46',
            borderColor: '#e4e4e7',
            highlightColor: '#fafafa',
          },
          contrast: {
            color: '#09090b',
            hoverColor: '#18181b',
            textColor: '#fafafa',
            highlightColor: 'rgba(9, 9, 11, 0.08)',
          },
        },
        dark: {
          primary: {
            color: '#10b981',
            hoverColor: '#34d399',
            focusColor: 'rgba(16, 185, 129, 0.45)',
            secondaryColor: 'rgba(16, 185, 129, 0.22)',
            selectedColor: 'rgba(16, 185, 129, 0.16)',
            highlightColor: 'rgba(16, 185, 129, 0.1)',
            colorDarker: '#059669',
            contrastColor: '#090a0f',
            borderColor: '#064e3b',
          },
          surface: {
            background: '#040d0a',
            cardBackground: '#0b1c16',
            contentBackground: '#10261f',
            border: 'rgba(16, 185, 129, 0.22)',
            boxShadow:
              '0 0 25px rgba(16, 185, 129, 0.15), 0 16px 36px -8px rgba(0, 0, 0, 0.7)',
            backdropBlur: '16px',
            darkText: '#ecfdf5',
            primaryText: '#d1fae5',
            secondaryText: '#6ee7b7',
            whiteText: '#fafafa',
          },
          secondary: {
            color: '#132e25',
            hoverColor: '#1a3d31',
            activeColor: '#224f40',
            onColor: '#ecfdf5',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            highlightColor: 'rgba(16, 185, 129, 0.08)',
          },
          contrast: {
            color: '#fafafa',
            hoverColor: '#f4f4f5',
            textColor: '#09090b',
            highlightColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  },
};

export default quantum;
