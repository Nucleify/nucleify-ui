import { html, nothing, type TemplateResult } from 'lit';
import type { NuiTreeViewState, TreeNode } from './types.js';

export type { NuiTreeViewState } from './types.js';

export interface NuiTreeHandlers {
  onToggle: (node: TreeNode) => void;
  onNodeClick: (node: TreeNode) => void;
}

function renderNode(node: TreeNode, handlers: NuiTreeHandlers): TemplateResult {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = !!node.expanded;

  return html`
    <div class="nui-tree-node">
      <div
        class="nui-tree-node-content"
        role="treeitem"
        aria-expanded=${hasChildren ? (isExpanded ? 'true' : 'false') : nothing}
        @click=${() => handlers.onNodeClick(node)}
      >
        ${
          hasChildren
            ? html`<button
              type="button"
              class="nui-tree-toggler"
              aria-label="Toggle node"
              @click=${(e: Event) => {
                e.stopPropagation();
                handlers.onToggle(node);
              }}
            ><nui-icon icon=${isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'} aria-hidden="true"></nui-icon></button>`
            : html`<span class="nui-tree-node-spacer"></span>`
        }
        ${
          node.icon
            ? html`<span class="nui-tree-node-icon"
              ><nui-icon icon=${node.icon} aria-hidden="true"></nui-icon
            ></span>`
            : nothing
        }
        <span class="nui-tree-node-label">
          ${
            node.type === 'url'
              ? html`<a
                href=${node.data || '#'}
                class=${node.class || nothing}
                @click=${() => {
                  // If it's a URL link, let it navigate, but still trigger node click
                  handlers.onNodeClick(node);
                }}
                >${node.label || ''}</a
              >`
              : html`<b class=${node.class || nothing}>${node.label || ''}</b>`
          }
        </span>
      </div>
      ${
        hasChildren && isExpanded
          ? html`
            <ul class="nui-tree-children" role="group">
              ${node.children?.map(
                (child) => html`
                  <li class="nui-tree-node-wrapper">
                    ${renderNode(child, handlers)}
                  </li>
                `,
              )}
            </ul>
          `
          : nothing
      }
    </div>
  `;
}

export function renderTree(
  state: NuiTreeViewState,
  handlers: NuiTreeHandlers,
): TemplateResult {
  const nodes = state.value || [];

  return html`
    <div
      class="nui-tree"
      role="tree"
      nui-type=${state.nuiType || nothing}
    >
      <ul class="nui-tree-list">
        ${nodes.map(
          (node) => html`
            <li class="nui-tree-node-wrapper">
              ${renderNode(node, handlers)}
            </li>
          `,
        )}
      </ul>
    </div>
  `;
}
