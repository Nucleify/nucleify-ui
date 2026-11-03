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
            focusColor: '#d97706',
            secondaryColor: 'rgba(217, 119, 6, 0.2)',
            selectedColor: 'rgba(217, 119, 6, 0.15)',
            highlightColor: 'rgba(217, 119, 6, 0.1)',
            colorDarker: '#92400e',
            contrastColor: '#ffffff',
            borderColor: '#fcd34d',
          },
          surface: {
            background: '#fffbeb',
            cardBackground: '#f8fafc',
            contentBackground: '#fffdf5',
            border: '#fcd34d',
            boxShadow: '3px 3px 0px rgba(217, 119, 6, 0.4)',
            darkText: '#0a0a0a',
            primaryText: '#0f172a',
            secondaryText: '#475569',
            whiteText: '#0a0a0a',
          },
          secondary: {
            color: '#e2e8f0',
            hoverColor: '#cbd5e1',
            activeColor: '#94a3b8',
            onColor: '#0f172a',
            borderColor: '#94a3b8',
            highlightColor: '#f1f5f9',
          },
          contrast: {
            color: '#0a0a0a',
            hoverColor: '#171717',
            textColor: '#ffffff',
            highlightColor: 'rgba(10, 10, 10, 0.1)',
          },
        },
        dark: {
          primary: {
            color: '#fbbf24',
            hoverColor: '#f59e0b',
            focusColor: '#fbbf24',
            secondaryColor: 'rgba(251, 191, 36, 0.25)',
            selectedColor: 'rgba(251, 191, 36, 0.18)',
            highlightColor: 'rgba(251, 191, 36, 0.1)',
            colorDarker: '#d97706',
            contrastColor: '#000000',
            borderColor: '#b45309',
          },
          surface: {
            background: '#0c0a06',
            cardBackground: '#161209',
            contentBackground: '#1e190d',
            border: 'rgba(245, 158, 11, 0.25)',
            boxShadow:
              '3px 3px 0px rgba(245, 158, 11, 0.22), 0 8px 24px -4px rgba(0, 0, 0, 0.7)',
            darkText: '#fef3c7',
            primaryText: '#fde68a',
            secondaryText: '#fbbf24',
            whiteText: '#ffffff',
          },
          secondary: {
            color: '#211a0c',
            hoverColor: '#302611',
            activeColor: '#423316',
            onColor: '#fef3c7',
            borderColor: 'rgba(245, 158, 11, 0.3)',
            highlightColor: 'rgba(251, 191, 36, 0.08)',
          },
          contrast: {
            color: '#ffffff',
            hoverColor: '#f4f4f5',
            textColor: '#000000',
            highlightColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  },
};

export default kinetic;
