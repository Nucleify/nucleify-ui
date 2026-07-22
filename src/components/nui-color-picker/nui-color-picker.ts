import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  formatColorValue,
  normalizeHex,
  parseColorValue,
  valuesEqual,
} from './color-math.js';
import { ColorPickerController } from './color-picker-controller.js';
import {
  getPreviewColor,
  type NuiColorPickerViewState,
  renderColorPicker,
} from './logic.js';
import type { ColorFormat, ColorValue } from './types.js';

const styles = createComponentStyles(
  'nui-color-picker',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-color-picker')
export class NuiColorPicker
  extends LitElement
  implements NuiColorPickerViewState
{
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  value: ColorValue = '';
  @property({ type: String, attribute: 'default-color' })
  defaultColor = 'ff0000';
  @property({ type: String }) format: ColorFormat = 'hex';
  @property({ type: Boolean, reflect: true }) inline = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: String }) name = '';
  @property({ type: String, attribute: 'input-id' }) inputId = '';
  @property({ type: Number }) tabindex = 0;
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'color-picker-class' })
  colorPickerClass = '';

  @state() overlayVisible = false;
  @state() hsb = parseColorValue('', 'hex', 'ff0000');

  private controller: ColorPickerController | null = null;
  private outsideClickListener: ((event: MouseEvent) => void) | null = null;
  private escapeListener: ((event: KeyboardEvent) => void) | null = null;

  protected createRenderRoot() {
    const root = super.createRenderRoot();
    void styles.sync(root, { unstyled: this.unstyled });
    return root;
  }

  protected firstUpdated() {
    this.syncHsbFromValue();
    this.initController();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.controller?.destroy();
    this.controller = null;
    this.unbindOverlayListeners();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (
      changed.has('value') ||
      changed.has('defaultColor') ||
      changed.has('format')
    ) {
      this.syncHsbFromValue();
    }

    if (
      changed.has('disabled') ||
      changed.has('inline') ||
      changed.has('overlayVisible')
    ) {
      this.initController();
    }

    if (changed.has('overlayVisible')) {
      if (this.overlayVisible) {
        this.bindOverlayListeners();
      } else {
        this.unbindOverlayListeners();
      }
    }
  }

  private syncHsbFromValue(): void {
    this.hsb = parseColorValue(this.value, this.format, this.defaultColor);
  }

  private initController(): void {
    const root = this.renderRoot.querySelector('.nui-color-picker-selector');

    if (!root || this.disabled) {
      this.controller?.destroy();
      this.controller = null;
      return;
    }

    this.controller?.destroy();
    this.controller = new ColorPickerController({
      root: root as HTMLElement,
      getDisabled: () => this.disabled,
      getHsb: () => this.hsb,
      setHsb: (hsb, emitInput) => this.updateColor(hsb, emitInput, false),
      onDragEnd: (event) => this.updateColor(this.hsb, false, true, event),
    });
  }

  private bindOverlayListeners(): void {
    this.outsideClickListener = (event: MouseEvent) => {
      const path = event.composedPath();

      if (path.includes(this)) {
        return;
      }

      this.hideOverlay();
    };

    this.escapeListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.hideOverlay();
      }
    };

    document.addEventListener('mousedown', this.outsideClickListener);
    document.addEventListener('keydown', this.escapeListener);
  }

  private unbindOverlayListeners(): void {
    if (this.outsideClickListener) {
      document.removeEventListener('mousedown', this.outsideClickListener);
      this.outsideClickListener = null;
    }

    if (this.escapeListener) {
      document.removeEventListener('keydown', this.escapeListener);
      this.escapeListener = null;
    }
  }

  private hideOverlay(): void {
    if (!this.overlayVisible) {
      return;
    }

    this.overlayVisible = false;
    this.dispatchEvent(
      new CustomEvent('hide', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private showOverlay(): void {
    if (this.overlayVisible || this.inline) {
      return;
    }

    this.overlayVisible = true;
    this.dispatchEvent(
      new CustomEvent('show', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private toggleOverlay(): void {
    if (this.overlayVisible) {
      this.hideOverlay();
    } else {
      this.showOverlay();
    }
  }

  private updateColor(
    hsb: typeof this.hsb,
    emitInput: boolean,
    emitChange: boolean,
    originalEvent?: Event,
  ): void {
    this.hsb = hsb;
    const nextValue = formatColorValue(hsb, this.format);

    if (!valuesEqual(this.value, nextValue, this.format)) {
      this.value = nextValue;
    }

    if (emitInput) {
      this.dispatchEvent(
        new CustomEvent('input', {
          detail: { value: nextValue },
          bubbles: true,
          composed: true,
        }),
      );
    }

    if (emitChange) {
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { value: nextValue, originalEvent },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private handlePreviewClick = (event: Event): void => {
    if (this.disabled || this.inline) {
      return;
    }

    event.stopPropagation();
    this.toggleOverlay();
  };

  private handlePreviewKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled || this.inline) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleOverlay();
    }
  };

  get hiddenValue(): string {
    return normalizeHex(
      typeof this.value === 'string' && this.value
        ? this.value
        : (formatColorValue(this.hsb, 'hex') as string),
    );
  }

  get previewColor(): string {
    return getPreviewColor(this.hsb);
  }

  render() {
    return renderColorPicker(
      {
        format: this.format,
        inline: this.inline,
        disabled: this.disabled,
        invalid: this.invalid,
        name: this.name,
        inputId: this.inputId,
        tabindex: this.tabindex,
        colorPickerClass: this.colorPickerClass,
        nuiType: this.nuiType,
        overlayVisible: this.overlayVisible,
        hsb: this.hsb,
        hiddenValue: this.hiddenValue,
        previewColor: this.previewColor,
      },
      {
        onPreviewClick: this.handlePreviewClick,
        onPreviewKeyDown: this.handlePreviewKeyDown,
      },
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-color-picker': NuiColorPicker;
  }
}
