import type {
  ComponentTokens,
  PrimitiveTokens,
  SemanticTokens,
} from './tokens.js';

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export interface PresetTokens {
  primitive?: PrimitiveTokens;
  semantic: SemanticTokens;
  components?: ComponentTokens;
}

export interface Preset {
  name: string;
  tokens: PresetTokens;
  css?: string;
}

export type ThemeMode = 'light' | 'dark';

export type PresetName =
  | 'nucleus'
  | 'quantum'
  | 'kinetic'
  | 'cosmos'
  | 'apex'
  | 'eclipse'
  | 'prism'
  | 'abyss';

export interface ThemeOptions {
  mode?: ThemeMode;
  darkModeSelector?: string;
  target?: HTMLElement | Document;
}
