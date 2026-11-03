export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface BorderRadiusTokens {
  none?: string;
  '2xs'?: string;
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  full?: string;
}

export interface TransitionTokens {
  fast?: string;
  medium?: string;
  slow?: string;
  easing?: string;
}

export interface SeverityToken {
  color: string;
  hoverColor: string;
  activeColor?: string;
  highlightColor: string;
}

export interface SemanticColorScheme {
  primary: {
    color: string;
    hoverColor: string;
    activeColor?: string;
    darkColor?: string;
    focusColor: string;
    secondaryColor: string;
    selectedColor: string;
    highlightColor: string;
    colorDarker?: string;
    contrastColor?: string;
    borderColor?: string;
  };
  surface: {
    background: string;
    cardBackground: string;
    contentBackground: string;
    border: string;
    boxShadow?: string;
    backdropBlur?: string;
    text?: string;
    primaryText: string;
    secondaryText: string;
    whiteText: string;
    darkText: string;
  };
  secondary: {
    color: string;
    hoverColor: string;
    activeColor: string;
    onColor: string;
    borderColor: string;
    highlightColor: string;
  };
  contrast: {
    color: string;
    hoverColor: string;
    textColor: string;
    highlightColor: string;
  };
}

export interface SemanticTokens {
  primary?: ColorScale | string;
  colorScheme: {
    light: SemanticColorScheme;
    dark: SemanticColorScheme;
  };
  severity?: {
    success?: SeverityToken;
    info?: SeverityToken;
    warn?: SeverityToken;
    help?: SeverityToken;
    danger?: SeverityToken;
  };
}

export interface PrimitiveTokens {
  borderRadius?: BorderRadiusTokens;
  transitions?: TransitionTokens;
  colors?: Record<string, ColorScale>;
}

export type ComponentTokens = Record<string, Record<string, string | number>>;
