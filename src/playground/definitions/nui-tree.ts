import { html, type TemplateResult } from 'lit';
import type { TreeNode } from '../../components/nui-tree/types.js';
import type {
  PlaygroundControl,
  PlaygroundDefinition,
  PlaygroundPreviewHandlers,
  PlaygroundProps,
} from '../types.js';
import { formatUsageFromDefaults, whenBoolean, whenString } from '../types.js';

export const NUI_TREE_DEFAULTS: PlaygroundProps = {
  unstyled: false,
  nuiType: '',
};

export const ATTRIBUTE_NAMES: string[] = ['unstyled', 'nui-type'];

export const CONTROLS: PlaygroundControl[] = [
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

const DEMO_TREE: TreeNode[] = [
  {
    key: '0',
    label: 'src',
    icon: 'mdi:folder-open',
    expanded: true,
    children: [
      {
        key: '0-0',
        label: 'components',
        icon: 'mdi:folder',
        expanded: true,
        children: [
          {
            key: '0-0-0',
            label: 'nui-tree.ts',
            icon: 'mdi:file-code-outline',
          },
          {
            key: '0-0-1',
            label: 'logic.ts',
            icon: 'mdi:file-code-outline',
          },
          {
            key: '0-0-2',
            label: 'styles.css',
            icon: 'mdi:file-document-outline',
          },
        ],
      },
      {
        key: '0-1',
        label: 'playground',
        icon: 'mdi:folder',
        expanded: false,
        children: [
          {
            key: '0-1-0',
            label: 'registry.ts',
            icon: 'mdi:file-code-outline',
          },
        ],
      },
    ],
  },
  {
    key: '1',
    label: 'docs',
    icon: 'mdi:folder',
    expanded: false,
    children: [
      {
        key: '1-0',
        label: 'Getting Started',
        type: 'url',
        data: 'https://nucleify.io/docs/getting-started',
        icon: 'mdi:link-variant',
      },
      {
        key: '1-1',
        label: 'API Reference',
        type: 'url',
        data: 'https://nucleify.io/docs/api',
        icon: 'mdi:link-variant',
      },
    ],
  },
];

function handleNodeSelect(event: Event) {
  const detail = (event as CustomEvent<{ node: TreeNode }>).detail;
  console.log(
    'Tree node selected:',
    detail.node.label,
    'key:',
    detail.node.key,
  );
}

function handleNodeExpand(event: Event) {
  const detail = (event as CustomEvent<{ node: TreeNode }>).detail;
  console.log(
    'Tree node expanded:',
    detail.node.label,
    'key:',
    detail.node.key,
  );
}

function handleNodeCollapse(event: Event) {
  const detail = (event as CustomEvent<{ node: TreeNode }>).detail;
  console.log(
    'Tree node collapsed:',
    detail.node.label,
    'key:',
    detail.node.key,
  );
}

function renderPreview(
  props: PlaygroundProps,
  _handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  return html`
    <div style="max-width: 800px; width: 100%; margin: 0 auto; padding: var(--spacing-md);">
      <nui-tree
        .value=${DEMO_TREE}
        ?unstyled=${whenBoolean(props.unstyled)}
        nui-type=${whenString(props.nuiType)}
        @nui-node-select=${handleNodeSelect}
        @nui-node-expand=${handleNodeExpand}
        @nui-node-collapse=${handleNodeCollapse}
      ></nui-tree>
    </div>
  `;
}

export const nuiTreePlayground: PlaygroundDefinition = {
  tag: 'nui-tree',
  label: 'Tree',
  description: 'A hierarchical tree list component.',
  defaults: NUI_TREE_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults('nui-tree', props, NUI_TREE_DEFAULTS, {}),
};
