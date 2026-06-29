import { html, type TemplateResult } from 'lit';
import type { NuiTerminal } from '../../components/nui-terminal/nui-terminal.js';
import type {
  PlaygroundControl,
  PlaygroundDefinition,
  PlaygroundPreviewHandlers,
  PlaygroundProps,
} from '../types.js';
import { formatUsageFromDefaults, whenBoolean, whenString } from '../types.js';

export const NUI_TERMINAL_DEFAULTS: PlaygroundProps = {
  welcomeMessage:
    'Welcome to Nucleify Terminal\nType "help" for a list of available commands.',
  prompt: 'guest@nucleify:~$ ',
  unstyled: false,
  nuiType: '',
};

export const ATTRIBUTE_NAMES: string[] = [
  'welcome-message',
  'prompt',
  'unstyled',
  'nui-type',
];

export const CONTROLS: PlaygroundControl[] = [
  {
    key: 'welcomeMessage',
    label: 'welcome-message',
    type: 'text',
    section: 'Layout',
  },
  {
    key: 'prompt',
    label: 'prompt',
    type: 'text',
    section: 'Layout',
  },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'nuiType',
    label: 'nui-type',
    type: 'text',
    section: 'Modifiers',
  },
];

function handleTerminalCommand(event: Event) {
  const terminal = event.target as NuiTerminal;
  const detail = (event as CustomEvent<{ command: string }>).detail;
  const commandText = detail.command.trim();

  if (!commandText) {
    return;
  }

  const parts = commandText.split(' ');
  const baseCmd = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');

  if (baseCmd === 'clear') {
    return;
  }

  setTimeout(() => {
    switch (baseCmd) {
      case 'help':
        terminal.writeResponse(
          'Available commands:\n  help      - Show this help message\n  clear     - Clear the terminal screen\n  date      - Print current date and time\n  version   - Print Nucleify UI version\n  hello     - Greet you (e.g. "hello user")\n  nucleify  - Learn about Nucleify',
        );
        break;
      case 'date':
        terminal.writeResponse(new Date().toString());
        break;
      case 'version':
        terminal.writeResponse('Nucleify UI v0.1.0 (Lit & TypeScript)');
        break;
      case 'hello':
        terminal.writeResponse(
          `Hello ${args || 'stranger'}! Welcome to the Nucleify Shell.`,
        );
        break;
      case 'nucleify':
        terminal.writeResponse(
          'Nucleify is a modern visual web application builder. It provides developers with highly extensible web components and atomic styling foundations.',
        );
        break;
      default:
        terminal.writeResponse(
          `bash: command not found: ${parts[0]}\nType "help" for a list of available commands.`,
        );
    }
  }, 150);
}

function renderPreview(
  props: PlaygroundProps,
  _handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  return html`
    <div style="max-width: 800px; width: 100%; margin: 0 auto; padding: var(--spacing-md);">
      <nui-terminal
        welcome-message=${whenString(props.welcomeMessage)}
        prompt=${whenString(props.prompt)}
        ?unstyled=${whenBoolean(props.unstyled)}
        nui-type=${whenString(props.nuiType)}
        @nui-command=${handleTerminalCommand}
      ></nui-terminal>
    </div>
  `;
}

export const nuiTerminalPlayground: PlaygroundDefinition = {
  tag: 'nui-terminal',
  label: 'Terminal',
  description: 'An interactive text terminal component.',
  defaults: NUI_TERMINAL_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-terminal',
      props,
      NUI_TERMINAL_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
