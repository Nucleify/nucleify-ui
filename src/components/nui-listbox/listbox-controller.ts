export interface ListboxControllerOptions {
  root: HTMLElement;
  getDisabled: () => boolean;
  getReadonly: () => boolean;
  getOptionCount: () => number;
  getFocusedIndex: () => number;
  setFocusedIndex: (index: number) => void;
  selectFocused: () => void;
  isFilterTarget: (target: EventTarget | null) => boolean;
}

export class ListboxController {
  private readonly root: HTMLElement;
  private readonly options: ListboxControllerOptions;

  constructor(options: ListboxControllerOptions) {
    this.root = options.root;
    this.options = options;
    this.root.addEventListener('keydown', this.handleKeyDown);
  }

  destroy(): void {
    this.root.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (
      this.options.getDisabled() ||
      this.options.getReadonly() ||
      this.options.isFilterTarget(event.target)
    ) {
      return;
    }

    const count = this.options.getOptionCount();

    if (count === 0) {
      return;
    }

    let next = this.options.getFocusedIndex();

    switch (event.code) {
      case 'ArrowDown':
        next = next < count - 1 ? next + 1 : 0;
        event.preventDefault();
        break;
      case 'ArrowUp':
        next = next > 0 ? next - 1 : count - 1;
        event.preventDefault();
        break;
      case 'Home':
        next = 0;
        event.preventDefault();
        break;
      case 'End':
        next = count - 1;
        event.preventDefault();
        break;
      case 'Enter':
      case 'Space':
        this.options.selectFocused();
        event.preventDefault();
        return;
      default:
        return;
    }

    this.options.setFocusedIndex(next);
  };
}
