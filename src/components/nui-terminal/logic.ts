import { html, nothing, type TemplateResult } from 'lit';
import type { NuiTerminalViewState } from './types.js';

export type { NuiTerminalViewState } from './types.js';

export interface NuiTerminalHandlers {
  onKeyDown: (event: KeyboardEvent) => void;
  onContainerClick: () => void;
}

export function renderTerminal(
  state: NuiTerminalViewState,
  handlers: NuiTerminalHandlers,
): TemplateResult {
  const prompt = state.prompt || 'guest@nucleify:~$ ';

  return html`
    <div
      class="nui-terminal"
      nui-type=${state.nuiType || nothing}
      @click=${handlers.onContainerClick}
    >
      <div class="nui-terminal-content">
        ${
          state.welcomeMessage
            ? html`<div class="nui-terminal-welcome">${state.welcomeMessage}</div>`
            : nothing
        }
        <div class="nui-terminal-history">
          ${state.history.map(
            (item) => html`
              <div class="nui-terminal-line">
                <div class="nui-terminal-command-line">
                  <span class="nui-terminal-prompt">${prompt}</span>
                  <span class="nui-terminal-command-text">${item.command}</span>
                </div>
                ${
                  item.response !== undefined
                    ? html`<div class="nui-terminal-response-line">${item.response}</div>`
                    : nothing
                }
              </div>
            `,
          )}
        </div>
      </div>
      <div class="nui-terminal-input-line">
        <span class="nui-terminal-prompt">${prompt}</span>
        <input
          class="nui-terminal-input"
          type="text"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          @keydown=${handlers.onKeyDown}
        />
      </div>
    </div>
  `;
}
