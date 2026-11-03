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
            focusColor: 'rgba(147, 51, 234, 0.45)',
            secondaryColor: 'rgba(147, 51, 234, 0.2)',
            selectedColor: 'rgba(147, 51, 234, 0.15)',
            highlightColor: 'rgba(147, 51, 234, 0.1)',
            colorDarker: '#6b21a8',
            contrastColor: '#ffffff',
            borderColor: '#d8b4fe',
          },
          surface: {
            background: '#f3e8ff',
            cardBackground: '#ffffff',
            contentBackground: '#faf5ff',
            border: '#d8b4fe',
            boxShadow:
              '0 8px 26px -4px rgba(147, 51, 234, 0.28), 0 1px 4px rgba(147, 51, 234, 0.12)',
            darkText: '#2e1065',
            primaryText: '#3b0764',
            secondaryText: '#7e22ce',
            whiteText: '#2e1065',
          },
          secondary: {
            color: '#f3e8ff',
            hoverColor: '#e9d5ff',
            activeColor: '#d8b4fe',
            onColor: '#581c87',
            borderColor: '#d8b4fe',
            highlightColor: '#faf5ff',
          },
          contrast: {
            color: '#3b0764',
            hoverColor: '#2e1065',
            textColor: '#ffffff',
            highlightColor: 'rgba(59, 7, 100, 0.08)',
          },
        },
        dark: {
          primary: {
            color: '#c084fc',
            hoverColor: '#a855f7',
            focusColor: 'rgba(192, 132, 252, 0.55)',
            secondaryColor: 'rgba(192, 132, 252, 0.25)',
            selectedColor: 'rgba(192, 132, 252, 0.18)',
            highlightColor: 'rgba(192, 132, 252, 0.12)',
            colorDarker: '#9333ea',
            contrastColor: '#05030e',
            borderColor: '#6b21a8',
          },
          surface: {
            background: '#05030e',
            cardBackground: '#0d081f',
            contentBackground: '#130c2b',
            border: 'rgba(168, 85, 247, 0.2)',
            boxShadow:
              '0 0 25px rgba(168, 85, 247, 0.15), 0 8px 32px 0 rgba(0, 0, 0, 0.6)',
            darkText: '#f3e8ff',
            primaryText: '#e9d5ff',
            secondaryText: '#c084fc',
            whiteText: '#faf5ff',
          },
          secondary: {
            color: '#1e113a',
            hoverColor: '#2e1957',
            activeColor: '#3e2175',
            onColor: '#f3e8ff',
            borderColor: 'rgba(168, 85, 247, 0.3)',
            highlightColor: 'rgba(192, 132, 252, 0.08)',
          },
          contrast: {
            color: '#faf5ff',
            hoverColor: '#f3e8ff',
            textColor: '#05030e',
            highlightColor: 'rgba(255, 255, 255, 0.12)',
          },
        },
      },
    },
  },
};

export default cosmos;
