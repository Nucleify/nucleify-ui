declare module 'nui-rainbow' {
  export interface NuiRainbowOptions {
    duration?: string | number;
    initialHue?: string | number;
    from?: string | number;
    easing?: string;
    iterations?: string | number;
    delay?: string | number;
    direction?: string;
    saturation?: string | number;
    lightness?: string | number;
    alpha?: string | number;
    hueSpan?: string | number;
    fillMode?: string;
    mode?: 'css' | 'gpu' | 'js';
    cycle?: 'linear' | 'branded';
    fps?: number;
    autoPause?: boolean;
    paused?: boolean;
    reducedMotion?: 'pause' | 'ignore';
  }

  export function applyRainbow(
    el?: Element | null,
    options?: NuiRainbowOptions,
  ): () => void;

  export function ensureRainbowStyles(): void;
}
