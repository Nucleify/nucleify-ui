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
            focusColor: 'rgba(16, 185, 129, 0.5)',
            secondaryColor: 'rgba(16, 185, 129, 0.2)',
            selectedColor: 'rgba(16, 185, 129, 0.15)',
            highlightColor: 'rgba(16, 185, 129, 0.1)',
            colorDarker: '#047857',
            contrastColor: '#ffffff',
            borderColor: '#6ee7b7',
          },
          surface: {
            background: '#ecfdf5',
            cardBackground: '#ffffff',
            contentBackground: '#f4fdf9',
            border: '#3e9387',
            boxShadow:
              '0 4px 18px -4px rgba(16, 185, 129, 0.22), 0 1px 3px rgba(16, 185, 129, 0.12)',
            backdropBlur: '14px',
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
            color: '#09090b',
            hoverColor: '#18181b',
            textColor: '#fafafa',
            highlightColor: 'rgba(9, 9, 11, 0.08)',
          },
        },
        dark: {
          primary: {
            color: '#34d399',
            hoverColor: '#10b981',
            focusColor: 'rgba(52, 211, 153, 0.5)',
            secondaryColor: 'rgba(52, 211, 153, 0.2)',
            selectedColor: 'rgba(52, 211, 153, 0.15)',
            highlightColor: 'rgba(52, 211, 153, 0.1)',
            colorDarker: '#059669',
            contrastColor: '#040d0a',
            borderColor: '#065f46',
          },
          surface: {
            background: '#030a08',
            cardBackground: '#050f0c',
            contentBackground: '#071411',
            border: 'rgba(110, 231, 183, 0.34)',
            boxShadow:
              '0 8px 30px -4px rgba(16, 185, 129, 0.12), 0 4px 6px -1px rgb(0 0 0 / 0.55)',
            backdropBlur: '16px',
            darkText: '#d1fae5',
            primaryText: '#a7f3d0',
            secondaryText: '#7aa89a',
            whiteText: '#f8fafc',
          },
          secondary: {
            color: '#0a1612',
            hoverColor: '#10201a',
            activeColor: '#162b23',
            onColor: '#d1fae5',
            borderColor: 'rgba(110, 231, 183, 0.4)',
            highlightColor: 'rgba(52, 211, 153, 0.06)',
          },
          contrast: {
            color: '#fafafa',
            hoverColor: '#f4f4f5',
            textColor: '#09090b',
            highlightColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
  },
};

export default quantum;
