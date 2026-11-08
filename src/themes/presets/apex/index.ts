import { rose } from '../../palettes/index.js';
import type { Preset } from '../../types/preset.js';

export const apex: Preset = {
  name: 'apex',
  tokens: {
    primitive: {
      borderRadius: {
        none: '0px',
        '2xs': '2px',
        xs: '3px',
        sm: '4px',
        md: '6px',
        lg: '10px',
        xl: '14px',
        full: '9999px',
      },
      transitions: {
        fast: '0.12s',
        medium: '0.22s',
        slow: '0.35s',
      },
    },
    semantic: {
      primary: rose,
      colorScheme: {
        light: {
          primary: {
            color: '#e11d48',
            hoverColor: '#be123c',
            focusColor: 'rgba(225, 29, 72, 0.5)',
            secondaryColor: 'rgba(225, 29, 72, 0.2)',
            selectedColor: 'rgba(225, 29, 72, 0.15)',
            highlightColor: 'rgba(225, 29, 72, 0.1)',
            colorDarker: '#9f1239',
            contrastColor: '#ffffff',
            borderColor: '#fda4af',
          },
          surface: {
            background: '#fff1f2',
            cardBackground: '#ffffff',
            contentBackground: '#fff7f8',
            border: '#9c4d6d',
            boxShadow:
              '0 4px 18px -4px rgba(225, 29, 72, 0.22), 0 1px 3px rgba(225, 29, 72, 0.12)',
            darkText: '#1c1917',
            primaryText: '#1e293b',
            secondaryText: '#64748b',
            whiteText: '#1c1917',
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
            color: '#4c0519',
            hoverColor: '#350311',
            textColor: '#ffffff',
            highlightColor: 'rgba(76, 5, 25, 0.08)',
          },
        },
        dark: {
          primary: {
            color: '#fb7185',
            hoverColor: '#f43f5e',
            focusColor: 'rgba(251, 113, 133, 0.5)',
            secondaryColor: 'rgba(251, 113, 133, 0.2)',
            selectedColor: 'rgba(251, 113, 133, 0.15)',
            highlightColor: 'rgba(251, 113, 133, 0.1)',
            colorDarker: '#e11d48',
            contrastColor: '#0a0507',
            borderColor: '#9f1239',
          },
          surface: {
            background: '#080406',
            cardBackground: '#0d0709',
            contentBackground: '#120a0e',
            border: 'rgba(253, 164, 175, 0.34)',
            boxShadow:
              '0 8px 30px -4px rgba(225, 29, 72, 0.12), 0 4px 6px -1px rgb(0 0 0 / 0.55)',
            darkText: '#ffe4e6',
            primaryText: '#fecdd3',
            secondaryText: '#c49aa3',
            whiteText: '#f8fafc',
          },
          secondary: {
            color: '#14090d',
            hoverColor: '#1c0e13',
            activeColor: '#26141a',
            onColor: '#ffe4e6',
            borderColor: 'rgba(253, 164, 175, 0.4)',
            highlightColor: 'rgba(251, 113, 133, 0.06)',
          },
          contrast: {
            color: '#ffffff',
            hoverColor: '#fff1f2',
            textColor: '#0a0507',
            highlightColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
  },
};

export default apex;
