import { cyan } from '../../palettes/index.js';
import type { Preset } from '../../types/preset.js';

export const abyss: Preset = {
  name: 'abyss',
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
      primary: cyan,
      colorScheme: {
        light: {
          primary: {
            color: '#0891b2',
            hoverColor: '#0e7490',
            focusColor: 'rgba(8, 145, 178, 0.5)',
            secondaryColor: 'rgba(8, 145, 178, 0.2)',
            selectedColor: 'rgba(8, 145, 178, 0.15)',
            highlightColor: 'rgba(8, 145, 178, 0.1)',
            colorDarker: '#155e75',
            contrastColor: '#ffffff',
            borderColor: '#67e8f9',
          },
          surface: {
            background: '#ecfeff',
            cardBackground: '#ffffff',
            contentBackground: '#f5fcfd',
            border: '#3b819d',
            boxShadow:
              '0 4px 18px -4px rgba(8, 145, 178, 0.22), 0 1px 3px rgba(8, 145, 178, 0.12)',
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
            borderColor: '#64748b',
            highlightColor: '#f1f5f9',
          },
          contrast: {
            color: '#164e63',
            hoverColor: '#083344',
            textColor: '#ffffff',
            highlightColor: 'rgba(22, 78, 99, 0.08)',
          },
        },
        dark: {
          primary: {
            color: '#22d3ee',
            hoverColor: '#06b6d4',
            focusColor: 'rgba(34, 211, 238, 0.5)',
            secondaryColor: 'rgba(34, 211, 238, 0.2)',
            selectedColor: 'rgba(34, 211, 238, 0.15)',
            highlightColor: 'rgba(34, 211, 238, 0.1)',
            colorDarker: '#0891b2',
            contrastColor: '#030c14',
            borderColor: '#155e75',
          },
          surface: {
            background: '#03080c',
            cardBackground: '#050d14',
            contentBackground: '#07121a',
            border: 'rgba(103, 232, 249, 0.34)',
            boxShadow:
              '0 8px 30px -4px rgba(6, 182, 212, 0.12), 0 4px 6px -1px rgb(0 0 0 / 0.55)',
            darkText: '#cffafe',
            primaryText: '#a5f3fc',
            secondaryText: '#7a9eab',
            whiteText: '#f8fafc',
          },
          secondary: {
            color: '#0a1218',
            hoverColor: '#101a22',
            activeColor: '#16242e',
            onColor: '#cffafe',
            borderColor: 'rgba(103, 232, 249, 0.4)',
            highlightColor: 'rgba(34, 211, 238, 0.06)',
          },
          contrast: {
            color: '#f0fdfa',
            hoverColor: '#e0f2fe',
            textColor: '#030c14',
            highlightColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
  },
};

export default abyss;
