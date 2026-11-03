import { indigo } from '../../palettes/index.js';
import type { Preset } from '../../types/preset.js';

export const nucleus: Preset = {
  name: 'nucleus',
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
        fast: '0.15s',
        medium: '0.25s',
        slow: '0.35s',
      },
    },
    semantic: {
      primary: indigo,
      colorScheme: {
        light: {
          primary: {
            color: '#6366f1',
            hoverColor: '#4f46e5',
            focusColor: 'rgba(99, 102, 241, 0.5)',
            secondaryColor: 'rgba(99, 102, 241, 0.2)',
            selectedColor: 'rgba(99, 102, 241, 0.15)',
            highlightColor: 'rgba(99, 102, 241, 0.1)',
            colorDarker: '#4338ca',
            contrastColor: '#ffffff',
            borderColor: '#c7d2fe',
          },
          surface: {
            background: '#eef2ff',
            cardBackground: '#ffffff',
            contentBackground: '#f5f7ff',
            border: '#c7d2fe',
            boxShadow:
              '0 4px 18px -4px rgba(99, 102, 241, 0.22), 0 1px 3px rgba(99, 102, 241, 0.12)',
            darkText: '#0f172a',
            primaryText: '#1e293b',
            secondaryText: '#64748b',
            whiteText: '#0f172a',
          },
          secondary: {
            color: '#e2e8f0',
            hoverColor: '#cbd5e1',
            activeColor: '#94a3b8',
            onColor: '#475569',
            borderColor: '#cbd5e1',
            highlightColor: '#f1f5f9',
          },
          contrast: {
            color: '#0f172a',
            hoverColor: '#1e293b',
            textColor: '#ffffff',
            highlightColor: 'rgba(15, 23, 42, 0.08)',
          },
        },
        dark: {
          primary: {
            color: '#818cf8',
            hoverColor: '#6366f1',
            focusColor: 'rgba(129, 140, 248, 0.5)',
            secondaryColor: 'rgba(129, 140, 248, 0.2)',
            selectedColor: 'rgba(129, 140, 248, 0.15)',
            highlightColor: 'rgba(129, 140, 248, 0.1)',
            colorDarker: '#4f46e5',
            contrastColor: '#0b0f19',
            borderColor: '#3730a3',
          },
          surface: {
            background: '#070a14',
            cardBackground: '#0d1326',
            contentBackground: '#111833',
            border: 'rgba(99, 102, 241, 0.22)',
            boxShadow:
              '0 8px 30px -4px rgba(79, 70, 229, 0.18), 0 4px 6px -1px rgb(0 0 0 / 0.5)',
            darkText: '#e0e7ff',
            primaryText: '#c7d2fe',
            secondaryText: '#a5b4fc',
            whiteText: '#f8fafc',
          },
          secondary: {
            color: '#151e3d',
            hoverColor: '#1e2b54',
            activeColor: '#28386e',
            onColor: '#e0e7ff',
            borderColor: 'rgba(99, 102, 241, 0.3)',
            highlightColor: 'rgba(129, 140, 248, 0.08)',
          },
          contrast: {
            color: '#f8fafc',
            hoverColor: '#e2e8f0',
            textColor: '#0f172a',
            highlightColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
  },
};

export default nucleus;
