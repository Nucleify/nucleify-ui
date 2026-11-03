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
            focusColor: 'rgba(8, 145, 178, 0.45)',
            secondaryColor: 'rgba(8, 145, 178, 0.2)',
            selectedColor: 'rgba(8, 145, 178, 0.15)',
            highlightColor: 'rgba(8, 145, 178, 0.1)',
            colorDarker: '#155e75',
            contrastColor: '#ffffff',
            borderColor: '#a5f3fc',
          },
          surface: {
            background: '#e6fbfa',
            cardBackground: '#ffffff',
            contentBackground: '#f0fdfc',
            border: '#a5f3fc',
            boxShadow:
              '0 8px 26px -4px rgba(8, 145, 178, 0.26), 0 1px 4px rgba(8, 145, 178, 0.12)',
            darkText: '#083344',
            primaryText: '#164e63',
            secondaryText: '#0e7490',
            whiteText: '#083344',
          },
          secondary: {
            color: '#e0f2fe',
            hoverColor: '#bae6fd',
            activeColor: '#7dd3fc',
            onColor: '#0369a1',
            borderColor: '#bae6fd',
            highlightColor: '#f0f9ff',
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
            secondaryColor: 'rgba(34, 211, 238, 0.25)',
            selectedColor: 'rgba(34, 211, 238, 0.18)',
            highlightColor: 'rgba(34, 211, 238, 0.12)',
            colorDarker: '#0891b2',
            contrastColor: '#030c14',
            borderColor: '#0e7490',
          },
          surface: {
            background: '#020910',
            cardBackground: '#061928',
            contentBackground: '#0a2338',
            border: 'rgba(6, 182, 212, 0.25)',
            boxShadow:
              '0 0 25px rgba(6, 182, 212, 0.16), 0 14px 35px -6px rgba(0, 0, 0, 0.8)',
            darkText: '#e0f2fe',
            primaryText: '#bae6fd',
            secondaryText: '#7dd3fc',
            whiteText: '#f0f9ff',
          },
          secondary: {
            color: '#0a2338',
            hoverColor: '#103352',
            activeColor: '#174770',
            onColor: '#e0f2fe',
            borderColor: 'rgba(6, 182, 212, 0.3)',
            highlightColor: 'rgba(34, 211, 238, 0.1)',
          },
          contrast: {
            color: '#f0fdfa',
            hoverColor: '#e0f2fe',
            textColor: '#030c14',
            highlightColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  },
};

export default abyss;
