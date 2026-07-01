import { LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  type NuiTerminalHandlers,
  type NuiTerminalViewState,
  renderTerminal,
} from './logic.js';
import type { TerminalHistoryItem, TerminalProps } from './types.js';

const styles = createComponentStyles(
  'nui-terminal',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-terminal')
export class NuiTerminal extends LitElement implements TerminalProps {
  @property({ type: String, attribute: 'welcome-message' }) welcomeMessage = '';
  @property({ type: String }) prompt = 'guest@nucleify:~$ ';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';

  @state() history: TerminalHistoryItem[] = [];

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    this.focusInput();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (changed.has('history')) {
      this.scrollToBottom();
    }
  }

  public focusInput() {
    const input = this.renderRoot?.querySelector(
      '.nui-terminal-input',
    ) as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }

  public scrollToBottom() {
    // Wait for the DOM updates to render before scrolling
    setTimeout(() => {
      const content = this.renderRoot?.querySelector('.nui-terminal-content');
      if (content) {
        content.scrollTop = content.scrollHeight;
      }
    }, 0);
  }

  public writeResponse(text: string) {
    const historyCopy = [...this.history];
    if (historyCopy.length > 0) {
      const lastIndex = historyCopy.length - 1;
      const lastItem = historyCopy[lastIndex];
      historyCopy[lastIndex] = { ...lastItem, response: text };
      this.history = historyCopy;
    } else {
      this.history = [{ command: '', response: text }];
    }
  }

  public clearHistory() {
    this.history = [];
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const input = event.target as HTMLInputElement;
      const command = input.value;

      if (command.trim().toLowerCase() === 'clear') {
        this.clearHistory();
        input.value = '';
        this.dispatchEvent(
          new CustomEvent('nui-command', {
            detail: { command },
            bubbles: true,
            composed: true,
          }),
        );
        return;
      }

      this.history = [...this.history, { command }];
      input.value = '';

      this.dispatchEvent(
        new CustomEvent('nui-command', {
          detail: { command },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private get _handlers(): NuiTerminalHandlers {
    return {
      onKeyDown: (e) => this.handleKeyDown(e),
      onContainerClick: () => this.focusInput(),
    };
  }

  render() {
    const viewState: NuiTerminalViewState = {
      welcomeMessage: this.welcomeMessage,
      prompt: this.prompt,
      unstyled: this.unstyled,
      nuiType: this.nuiType,
      history: this.history,
    };

    return renderTerminal(viewState, this._handlers);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-terminal': NuiTerminal;
  }
}
