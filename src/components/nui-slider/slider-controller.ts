export interface SliderControllerOptions {
  root: HTMLElement;
  getMin: () => number;
  getMax: () => number;
  getStep: () => number;
  getRange: () => boolean;
  getOrientation: () => 'horizontal' | 'vertical';
  getDisabled: () => boolean;
  getValues: () => [number, number];
  setValues: (low: number, high: number, emitChange: boolean) => void;
  onSlideEnd: (event: Event) => void;
}

export class SliderController {
  private readonly root: HTMLElement;
  private readonly options: SliderControllerOptions;
  private dragging = false;
  private handleIndex = 0;
  private barSize = 0;
  private barStart = 0;
  private moveListener: ((event: MouseEvent | TouchEvent) => void) | null =
    null;
  private endListener: ((event: MouseEvent | TouchEvent) => void) | null = null;

  constructor(options: SliderControllerOptions) {
    this.root = options.root;
    this.options = options;
    this.bindEvents();
  }

  destroy(): void {
    this.unbindDragListeners();
    this.root.removeEventListener('mousedown', this.handleTrackPointerDown);
    this.root.removeEventListener('touchstart', this.handleTrackPointerDown);
    this.root.removeEventListener('keydown', this.handleKeyDown);
  }

  private bindEvents(): void {
    this.root.addEventListener('mousedown', this.handleTrackPointerDown);
    this.root.addEventListener('touchstart', this.handleTrackPointerDown);
    this.root.addEventListener('keydown', this.handleKeyDown);
  }

  private handleTrackPointerDown = (event: MouseEvent | TouchEvent): void => {
    if (this.options.getDisabled()) {
      return;
    }

    const target = event.target as HTMLElement;
    const handle = target.closest('.nui-slider-handle');

    if (handle) {
      const index = Number((handle as HTMLElement).dataset.handleIndex ?? '0');
      this.startDrag(event, index);
      return;
    }

    if (target.closest('.nui-slider-track')) {
      this.updateMetrics();
      const value = this.valueFromPointer(event);

      if (this.options.getRange()) {
        const [low, high] = this.options.getValues();
        this.handleIndex =
          Math.abs(value - low) <= Math.abs(value - high) ? 0 : 1;
      }

      this.setFromSingleValue(value, true);
      this.startDrag(event, this.handleIndex);
    }
  };

  private startDrag(event: MouseEvent | TouchEvent, index: number): void {
    event.preventDefault();
    this.updateMetrics();
    this.dragging = true;
    this.handleIndex = index;
    this.root.setAttribute('data-sliding', 'true');
    this.bindDragListeners();
    this.root
      .querySelector<HTMLElement>(
        `.nui-slider-handle[data-handle-index="${index}"]`,
      )
      ?.focus();
  }

  private handlePointerMove = (event: MouseEvent | TouchEvent): void => {
    if (!this.dragging) {
      return;
    }

    const value = this.valueFromPointer(event);
    this.setFromSingleValue(value, true);
  };

  private handlePointerEnd = (event: MouseEvent | TouchEvent): void => {
    if (!this.dragging) {
      return;
    }

    this.dragging = false;
    this.root.removeAttribute('data-sliding');
    this.unbindDragListeners();
    this.options.onSlideEnd(event);
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.options.getDisabled()) {
      return;
    }

    const target = event.target as HTMLElement;

    if (!target.classList.contains('nui-slider-handle')) {
      return;
    }

    const index = Number(target.dataset.handleIndex ?? '0');
    const [low, high] = this.options.getValues();
    const current = index === 0 ? low : high;
    let next = current;

    switch (event.code) {
      case 'ArrowDown':
      case 'ArrowLeft':
        next = this.decrement(current, event.shiftKey);
        event.preventDefault();
        break;
      case 'ArrowUp':
      case 'ArrowRight':
        next = this.increment(current, event.shiftKey);
        event.preventDefault();
        break;
      case 'Home':
        next = this.options.getMin();
        event.preventDefault();
        break;
      case 'End':
        next = this.options.getMax();
        event.preventDefault();
        break;
      default:
        return;
    }

    this.setFromSingleValue(next, true);
  };

  private bindDragListeners(): void {
    this.moveListener = this.handlePointerMove;
    this.endListener = this.handlePointerEnd;
    document.addEventListener('mousemove', this.moveListener);
    document.addEventListener('mouseup', this.endListener);
    document.addEventListener('touchmove', this.moveListener, {
      passive: false,
    });
    document.addEventListener('touchend', this.endListener);
  }

  private unbindDragListeners(): void {
    if (this.moveListener) {
      document.removeEventListener('mousemove', this.moveListener);
      document.removeEventListener('touchmove', this.moveListener);
      this.moveListener = null;
    }

    if (this.endListener) {
      document.removeEventListener('mouseup', this.endListener);
      document.removeEventListener('touchend', this.endListener);
      this.endListener = null;
    }
  }

  private updateMetrics(): void {
    const track = this.root.querySelector('.nui-slider-track');

    if (!track) {
      return;
    }

    const rect = track.getBoundingClientRect();

    if (this.options.getOrientation() === 'horizontal') {
      this.barStart = rect.left;
      this.barSize = rect.width;
    } else {
      this.barStart = rect.top;
      this.barSize = rect.height;
    }
  }

  private pointerPosition(event: MouseEvent | TouchEvent): number {
    if ('touches' in event && event.touches.length > 0) {
      return this.options.getOrientation() === 'horizontal'
        ? event.touches[0].pageX
        : event.touches[0].pageY;
    }

    return this.options.getOrientation() === 'horizontal'
      ? (event as MouseEvent).pageX
      : (event as MouseEvent).pageY;
  }

  private valueFromPointer(event: MouseEvent | TouchEvent): number {
    const position = this.pointerPosition(event);
    let ratio =
      this.barSize === 0 ? 0 : (position - this.barStart) / this.barSize;

    if (this.options.getOrientation() === 'vertical') {
      ratio = 1 - ratio;
    }

    const clampedRatio = Math.min(1, Math.max(0, ratio));
    const { getMin, getMax } = this.options;
    const raw = getMin() + (getMax() - getMin()) * clampedRatio;

    return this.applyStep(raw);
  }

  private applyStep(value: number): number {
    const { getMin, getMax, getStep } = this.options;
    const step = getStep();

    if (!step || step <= 0) {
      return Math.round(Math.min(getMax(), Math.max(getMin(), value)));
    }

    const stepped = getMin() + Math.round((value - getMin()) / step) * step;

    return Math.min(getMax(), Math.max(getMin(), stepped));
  }

  private increment(value: number, page: boolean): number {
    const step = this.options.getStep();
    const delta = step > 0 ? step : page ? 10 : 1;

    return this.applyStep(value + delta);
  }

  private decrement(value: number, page: boolean): number {
    const step = this.options.getStep();
    const delta = step > 0 ? step : page ? 10 : 1;

    return this.applyStep(value - delta);
  }

  private setFromSingleValue(value: number, emitChange: boolean): void {
    const { getRange, getMin, getMax } = this.options;
    let [low, high] = this.options.getValues();
    const clamped = Math.min(getMax(), Math.max(getMin(), value));

    if (getRange()) {
      if (this.handleIndex === 0) {
        low = Math.min(clamped, high);
      } else {
        high = Math.max(clamped, low);
      }
    } else {
      low = clamped;
      high = clamped;
    }

    this.options.setValues(low, high, emitChange);
  }
}
