import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiTextareaViewState, renderTextarea } from './logic.js';
import type { TextareaSize, TextareaVariant } from './types.js';

const styles = createComponentStyles(
  'nui-textarea',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-textarea')
export class NuiTextarea extends LitElement implements NuiTextareaViewState {
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean }) required = false;
  @property({ type: String }) name = '';
  @property({ type: String, attribute: 'textarea-id' }) textareaId = '';
  @property({ type: String, attribute: 'aria-label' }) ariaLabel = '';
  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledby = '';
  @property({ type: String }) autocomplete = '';
  @property({ type: Number }) maxlength = 0;
  @property({ type: Number }) minlength = 0;
  @property({ type: Number }) rows = 0;
  @property({ type: Number }) cols = 0;
  @property({ type: Boolean, attribute: 'auto-resize', reflect: true })
  autoResize = false;
  @property({ type: String, reflect: true }) size: TextareaSize | '' = '';
  @property({ type: String, reflect: true }) variant: TextareaVariant | '' = '';
  @property({ type: Boolean, reflect: true }) fluid = false;
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'textarea-class' })
  textareaClass = '';

  private resizeObserver: ResizeObserver | null = null;

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    this.setupAutoResize();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('autoResize')) {
      this.setupAutoResize();
    }

    if (
      this.autoResize &&
      (changed.has('value') || changed.has('autoResize'))
    ) {
      requestAnimationFrame(() => this.resize());
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private getTextarea(): HTMLTextAreaElement | null {
    return this.renderRoot.querySelector('.nui-textarea-input');
  }

  private setupAutoResize(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (!this.autoResize) {
      return;
    }

    const textarea = this.getTextarea();

    if (!textarea) {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => this.resize());
    });
    this.resizeObserver.observe(textarea);
    this.resize();
  }

  private resize(): void {
    const textarea = this.getTextarea();

    if (!textarea || !this.autoResize || !textarea.offsetParent) {
      return;
    }

    const currentHeight = textarea.style.height;
    const currentHeightValue = Number.parseInt(currentHeight, 10) || 0;
    const initialScrollHeight = textarea.scrollHeight;
    const needsExpanding =
      !currentHeightValue || initialScrollHeight > currentHeightValue;
    const needsShrinking =
      currentHeightValue > 0 && initialScrollHeight < currentHeightValue;

    if (needsShrinking) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    } else if (needsExpanding) {
      textarea.style.height = `${initialScrollHeight}px`;
    }
  }

  private handleInput = (event: Event): void => {
    const textarea = event.target as HTMLTextAreaElement;
    this.value = textarea.value;

    if (this.autoResize) {
      this.resize();
    }

    this.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private handleChange = (event: Event): void => {
    const textarea = event.target as HTMLTextAreaElement;
    this.value = textarea.value;

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    return renderTextarea(this, {
      onInput: this.handleInput,
      onChange: this.handleChange,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-textarea': NuiTextarea;
  }
}
