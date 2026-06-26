import { applyKnobStep, clampKnobValue, valueFromOffset } from './knob-math.js';

export interface KnobControllerOptions {
  root: SVGElement;
  getMin: () => number;
  getMax: () => number;
  getStep: () => number;
  getDisabled: () => boolean;
  getReadonly: () => boolean;
  getValue: () => number;
  setValue: (value: number, emitChange: boolean) => void;
}

export class KnobController {
  private readonly root: SVGElement;
  private readonly options: KnobControllerOptions;
  private dragging = false;
  private activePointerId: number | null = null;
  private moveListener: ((event: PointerEvent) => void) | null = null;
  private endListener: ((event: PointerEvent) => void) | null = null;

  constructor(options: KnobControllerOptions) {
    this.root = options.root;
    this.options = options;
    this.bindEvents();
  }

  destroy(): void {
    this.unbindDragListeners();
    this.root.removeEventListener('pointerdown', this.handlePointerDown);
    this.root.removeEventListener('keydown', this.handleKeyDown);
  }

  private bindEvents(): void {
    this.root.addEventListener('pointerdown', this.handlePointerDown);
    this.root.addEventListener('keydown', this.handleKeyDown);
  }

  private handlePointerDown = (event: PointerEvent): void => {
    if (
      this.options.getDisabled() ||
      this.options.getReadonly() ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    this.dragging = true;
    this.activePointerId = event.pointerId;
    this.root.setAttribute('data-sliding', 'true');
    this.root.setPointerCapture(event.pointerId);
    this.updateFromPointer(event, true);
    this.bindDragListeners();
    this.root.focus();
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.dragging || event.pointerId !== this.activePointerId) {
      return;
    }

    event.preventDefault();
    this.updateFromPointer(event, true);
  };

  private handlePointerEnd = (event: PointerEvent): void => {
    if (!this.dragging || event.pointerId !== this.activePointerId) {
      return;
    }

    this.dragging = false;
    this.activePointerId = null;
    this.root.removeAttribute('data-sliding');

    if (this.root.hasPointerCapture(event.pointerId)) {
      this.root.releasePointerCapture(event.pointerId);
    }

    this.unbindDragListeners();
    event.preventDefault();
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.options.getDisabled() || this.options.getReadonly()) {
      return;
    }

    const { getMin, getMax, getStep, getValue } = this.options;
    const step = getStep() > 0 ? getStep() : 1;
    let next = getValue();

    switch (event.code) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = applyKnobStep(getValue() + step, step, getMin(), getMax());
        event.preventDefault();
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = applyKnobStep(getValue() - step, step, getMin(), getMax());
        event.preventDefault();
        break;
      case 'Home':
        next = getMin();
        event.preventDefault();
        break;
      case 'End':
        next = getMax();
        event.preventDefault();
        break;
      case 'PageUp':
        next = clampKnobValue(getValue() + 10, getMin(), getMax());
        event.preventDefault();
        break;
      case 'PageDown':
        next = clampKnobValue(getValue() - 10, getMin(), getMax());
        event.preventDefault();
        break;
      default:
        return;
    }

    this.options.setValue(next, true);
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

  private updateFromPointer(event: PointerEvent, snapDeadZone: boolean): void {
    const rect = this.root.getBoundingClientRect();
    const size = rect.width || rect.height;

    if (!size) {
      return;
    }

    const next = valueFromOffset(
      event.clientX - rect.left,
      event.clientY - rect.top,
      size,
      this.options.getMin(),
      this.options.getMax(),
      this.options.getStep(),
      { snapDeadZone },
    );

    if (next !== null) {
      this.options.setValue(next, true);
    }
  }
}
