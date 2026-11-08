import { violet } from '../../palettes/index.js';
import type { Preset } from '../../types/preset.js';

export const cosmos: Preset = {
  name: 'cosmos',
  tokens: {
    primitive: {
      borderRadius: {
        none: '0px',
        '2xs': '3px',
        xs: '5px',
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '28px',
        full: '9999px',
      },
      transitions: {
        fast: '0.15s',
        medium: '0.25s',
        slow: '0.4s',
      },
    },
    semantic: {
      primary: violet,
      colorScheme: {
        light: {
          primary: {
            color: '#9333ea',
            hoverColor: '#7e22ce',
            focusColor: 'rgba(147, 51, 234, 0.5)',
            secondaryColor: 'rgba(147, 51, 234, 0.2)',
            selectedColor: 'rgba(147, 51, 234, 0.15)',
            highlightColor: 'rgba(147, 51, 234, 0.1)',
            colorDarker: '#6b21a8',
            contrastColor: '#ffffff',
            borderColor: '#c4b5fd',
          },
          surface: {
            background: '#f3e8ff',
            cardBackground: '#ffffff',
            contentBackground: '#f8f2ff',
            border: '#7957b6',
            boxShadow:
              '0 4px 18px -4px rgba(147, 51, 234, 0.22), 0 1px 3px rgba(147, 51, 234, 0.12)',
            darkText: '#1e1b4b',
            primaryText: '#1e293b',
            secondaryText: '#64748b',
            whiteText: '#1e1b4b',
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
            color: '#1e1b4b',
            hoverColor: '#312e81',
            textColor: '#ffffff',
            highlightColor: 'rgba(30, 27, 75, 0.08)',
          },
        },
        dark: {
          primary: {
            color: '#a78bfa',
            hoverColor: '#8b5cf6',
            focusColor: 'rgba(167, 139, 250, 0.5)',
            secondaryColor: 'rgba(167, 139, 250, 0.2)',
            selectedColor: 'rgba(167, 139, 250, 0.15)',
            highlightColor: 'rgba(167, 139, 250, 0.1)',
            colorDarker: '#7c3aed',
            contrastColor: '#05030e',
            borderColor: '#5b21b6',
          },
          surface: {
            background: '#05030c',
            cardBackground: '#090614',
            contentBackground: '#0c091a',
            border: 'rgba(196, 181, 253, 0.34)',
            boxShadow:
              '0 8px 30px -4px rgba(139, 92, 246, 0.12), 0 4px 6px -1px rgb(0 0 0 / 0.55)',
            darkText: '#ede9fe',
            primaryText: '#ddd6fe',
            secondaryText: '#9b93c9',
            whiteText: '#f8fafc',
          },
          secondary: {
            color: '#100c1e',
            hoverColor: '#171228',
            activeColor: '#1f1835',
            onColor: '#ede9fe',
            borderColor: 'rgba(196, 181, 253, 0.4)',
            highlightColor: 'rgba(167, 139, 250, 0.06)',
          },
          contrast: {
            color: '#faf5ff',
            hoverColor: '#f3e8ff',
            textColor: '#05030e',
            highlightColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
  },
};

export default cosmos;
