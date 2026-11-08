import { amber } from '../../palettes/index.js';
import type { Preset } from '../../types/preset.js';

export const kinetic: Preset = {
  name: 'kinetic',
  tokens: {
    primitive: {
      borderRadius: {
        none: '0px',
        '2xs': '1px',
        xs: '2px',
        sm: '2px',
        md: '2px',
        lg: '2px',
        xl: '2px',
        full: '2px',
      },
      transitions: {
        fast: '0.05s',
        medium: '0.1s',
        slow: '0.15s',
      },
    },
    semantic: {
      primary: amber,
      colorScheme: {
        light: {
          primary: {
            color: '#d97706',
            hoverColor: '#b45309',
            focusColor: 'rgba(217, 119, 6, 0.5)',
            secondaryColor: 'rgba(217, 119, 6, 0.2)',
            selectedColor: 'rgba(217, 119, 6, 0.15)',
            highlightColor: 'rgba(217, 119, 6, 0.1)',
            colorDarker: '#92400e',
            contrastColor: '#ffffff',
            borderColor: '#fbbf24',
          },
          surface: {
            background: '#fffbeb',
            cardBackground: '#ffffff',
            contentBackground: '#fffdf5',
            border: '#99754f',
            boxShadow:
              '0 4px 18px -4px rgba(217, 119, 6, 0.22), 0 1px 3px rgba(217, 119, 6, 0.12)',
            darkText: '#0a0a0a',
            primaryText: '#0f172a',
            secondaryText: '#64748b',
            whiteText: '#0a0a0a',
          },
          secondary: {
            color: '#e2e8f0',
            hoverColor: '#cbd5e1',
            activeColor: '#94a3b8',
            onColor: '#475569',
            borderColor: '#64748b',
            highlightColor: '#f1f5f9',
          },
          contrast: {
            color: '#0a0a0a',
            hoverColor: '#171717',
            textColor: '#ffffff',
            highlightColor: 'rgba(10, 10, 10, 0.08)',
          },
        },
        dark: {
          primary: {
            color: '#fbbf24',
            hoverColor: '#f59e0b',
            focusColor: 'rgba(251, 191, 36, 0.5)',
            secondaryColor: 'rgba(251, 191, 36, 0.2)',
            selectedColor: 'rgba(251, 191, 36, 0.15)',
            highlightColor: 'rgba(251, 191, 36, 0.1)',
            colorDarker: '#d97706',
            contrastColor: '#0c0a06',
            borderColor: '#92400e',
          },
          surface: {
            background: '#080705',
            cardBackground: '#0d0b07',
            contentBackground: '#12100a',
            border: 'rgba(252, 211, 77, 0.34)',
            boxShadow:
              '0 8px 30px -4px rgba(245, 158, 11, 0.12), 0 4px 6px -1px rgb(0 0 0 / 0.55)',
            darkText: '#fef3c7',
            primaryText: '#fde68a',
            secondaryText: '#b5a57a',
            whiteText: '#f8fafc',
          },
          secondary: {
            color: '#14110a',
            hoverColor: '#1c1810',
            activeColor: '#262110',
            onColor: '#fef3c7',
            borderColor: 'rgba(252, 211, 77, 0.4)',
            highlightColor: 'rgba(251, 191, 36, 0.06)',
          },
          contrast: {
            color: '#ffffff',
            hoverColor: '#f4f4f5',
            textColor: '#000000',
            highlightColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
  },
};

export default kinetic;
