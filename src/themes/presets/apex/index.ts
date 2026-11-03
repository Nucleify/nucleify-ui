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
            focusColor: 'rgba(225, 29, 72, 0.4)',
            secondaryColor: 'rgba(225, 29, 72, 0.15)',
            selectedColor: 'rgba(225, 29, 72, 0.12)',
            highlightColor: 'rgba(225, 29, 72, 0.08)',
            colorDarker: '#9f1239',
            contrastColor: '#ffffff',
            borderColor: '#fecdd3',
          },
          surface: {
            background: '#fff1f2',
            cardBackground: '#ffffff',
            contentBackground: '#fff5f6',
            border: '#fecdd3',
            boxShadow:
              '0 8px 26px -4px rgba(225, 29, 72, 0.24), 0 1px 4px rgba(225, 29, 72, 0.12)',
            darkText: '#4c0519',
            primaryText: '#881337',
            secondaryText: '#9f1239',
            whiteText: '#4c0519',
          },
          secondary: {
            color: '#fff1f2',
            hoverColor: '#ffe4e6',
            activeColor: '#fecdd3',
            onColor: '#881337',
            borderColor: '#fecdd3',
            highlightColor: '#fff5f6',
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
            color: '#f43f5e',
            hoverColor: '#e11d48',
            focusColor: 'rgba(244, 63, 94, 0.5)',
            secondaryColor: 'rgba(244, 63, 94, 0.22)',
            selectedColor: 'rgba(244, 63, 94, 0.16)',
            highlightColor: 'rgba(244, 63, 94, 0.1)',
            colorDarker: '#be123c',
            contrastColor: '#0a0507',
            borderColor: '#881337',
          },
          surface: {
            background: '#0a0507',
            cardBackground: '#12090d',
            contentBackground: '#180d12',
            border: 'rgba(225, 29, 72, 0.18)',
            boxShadow:
              '0 20px 45px -15px rgba(0, 0, 0, 0.75), 0 0 1px 1px rgba(225, 29, 72, 0.12)',
            darkText: '#fff1f2',
            primaryText: '#ffe4e6',
            secondaryText: '#fda4af',
            whiteText: '#ffffff',
          },
          secondary: {
            color: '#1f0d14',
            hoverColor: '#2d131d',
            activeColor: '#3d1a27',
            onColor: '#ffe4e6',
            borderColor: 'rgba(225, 29, 72, 0.25)',
            highlightColor: 'rgba(244, 63, 94, 0.08)',
          },
          contrast: {
            color: '#ffffff',
            hoverColor: '#fff1f2',
            textColor: '#0a0507',
            highlightColor: 'rgba(255, 255, 255, 0.12)',
          },
        },
      },
    },
  },
};

export default apex;
