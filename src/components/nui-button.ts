import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('nui-button')
export class NuiButton extends LitElement {
  @property({ type: String }) label = 'Button';
  @property({ type: String }) variant: 'primary' | 'secondary' = 'primary';
  @property({ type: Boolean }) disabled = false;

  static styles = css`
    :host {
      display: inline-block;
    }

    .nui-button {
      padding: var(--spacing-xs) var(--spacing-md);
      border: none;
      border-radius: var(--border-radius-sm);
      font: inherit;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: var(--transition-fast) ease;
    }

    .nui-button:focus-visible {
      outline: var(--border-width-focus) solid var(--nuc-primary-focus-color);
      outline-offset: var(--outline-offset);
    }

    .nui-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .nui-button.primary {
      background: var(--nuc-primary-color);
      color: var(--nuc-primary-white-text-color);
    }

    .nui-button.primary:hover:not(:disabled) {
      background: var(--nuc-primary-hover-color);
    }

    .nui-button.primary:active:not(:disabled) {
      background: var(--nuc-primary-color-darker);
    }

    .nui-button.secondary {
      background: var(--nuc-primary-secondary-color);
      color: var(--nuc-primary-text-color);
      border: var(--border-width) solid var(--nuc-card-border);
    }

    .nui-button.secondary:hover:not(:disabled) {
      background: var(--nuc-primary-selected-color);
      border-color: var(--nuc-primary-border-color);
    }
  `;

  render() {
    return html`
      <button class="nui-button ${this.variant}" ?disabled=${this.disabled}>
        ${this.label}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-button': NuiButton;
  }
}
