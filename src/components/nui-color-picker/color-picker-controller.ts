import { clamp, normalizeHsb } from './color-math.js';
import type { ColorHsb } from './types.js';

export interface ColorPickerControllerOptions {
  root: HTMLElement;
  getDisabled: () => boolean;
  getHsb: () => ColorHsb;
  setHsb: (hsb: ColorHsb, emitInput: boolean) => void;
  onDragEnd: (event: Event) => void;
}

export class ColorPickerController {
  private readonly root: HTMLElement;
  private readonly options: ColorPickerControllerOptions;
  private draggingTarget: 'color' | 'hue' | null = null;
  private moveListener: ((event: PointerEvent) => void) | null = null;
  private endListener: ((event: PointerEvent) => void) | null = null;

  constructor(options: ColorPickerControllerOptions) {
    this.root = options.root;
    this.options = options;
    this.bindEvents();
  }

  destroy(): void {
    this.unbindDragListeners();
    this.root.removeEventListener('pointerdown', this.handlePointerDown);
  }

  private bindEvents(): void {
    this.root.addEventListener('pointerdown', this.handlePointerDown);
  }

  private handlePointerDown = (event: PointerEvent): void => {
    if (this.options.getDisabled() || event.button !== 0) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest('.nui-color-picker-hue')) {
      this.startDrag(event, 'hue');
      return;
    }

    if (target.closest('.nui-color-picker-color')) {
      this.startDrag(event, 'color');
    }
  };

  private startDrag(event: PointerEvent, target: 'color' | 'hue'): void {
    event.preventDefault();
    this.draggingTarget = target;
    this.root.setPointerCapture(event.pointerId);
    this.updateFromPointer(event, true);
    this.bindDragListeners();
  }

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.draggingTarget) {
      return;
    }

    event.preventDefault();
    this.updateFromPointer(event, true);
  };

  private handlePointerEnd = (event: PointerEvent): void => {
    if (!this.draggingTarget) {
      return;
    }

    this.updateFromPointer(event, true);
    this.draggingTarget = null;

    if (this.root.hasPointerCapture(event.pointerId)) {
      this.root.releasePointerCapture(event.pointerId);
    }

    this.unbindDragListeners();
    this.options.onDragEnd(event);
  };

  private bindDragListeners(): void {
    this.moveListener = this.handlePointerMove;
    this.endListener = this.handlePointerEnd;
    this.root.addEventListener('pointermove', this.moveListener);
    this.root.addEventListener('pointerup', this.endListener);
    this.root.addEventListener('pointercancel', this.endListener);
  }

  private unbindDragListeners(): void {
    if (this.moveListener) {
      this.root.removeEventListener('pointermove', this.moveListener);
      this.moveListener = null;
    }

    if (this.endListener) {
      this.root.removeEventListener('pointerup', this.endListener);
      this.root.removeEventListener('pointercancel', this.endListener);
      this.endListener = null;
    }
  }

  private updateFromPointer(event: PointerEvent, emitInput: boolean): void {
    if (this.draggingTarget === 'hue') {
      const hueElement = this.root.querySelector('.nui-color-picker-hue');

      if (!hueElement) {
        return;
      }

      const rect = hueElement.getBoundingClientRect();
      const ratio = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      const current = this.options.getHsb();

      this.options.setHsb(
        normalizeHsb({
          ...current,
          h: ratio * 360,
        }),
        emitInput,
      );
      return;
    }

    const colorElement = this.root.querySelector('.nui-color-picker-color');

    if (!colorElement) {
      return;
    }

    const rect = colorElement.getBoundingClientRect();
    const saturation =
      clamp((event.clientX - rect.left) / rect.width, 0, 1) * 100;
    const brightness =
      (1 - clamp((event.clientY - rect.top) / rect.height, 0, 1)) * 100;
    const current = this.options.getHsb();

    this.options.setHsb(
      normalizeHsb({
        ...current,
        s: saturation,
        b: brightness,
      }),
      emitInput,
    );
  }
}
