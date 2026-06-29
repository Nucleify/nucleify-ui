import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import {
  type NuiTreeHandlers,
  type NuiTreeViewState,
  renderTree,
} from './logic.js';
import type { TreeNode, TreeProps } from './types.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-tree')
export class NuiTree extends LitElement implements TreeProps {
  @property({ type: Array }) value: TreeNode[] = [];
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  private handleToggle(node: TreeNode) {
    node.expanded = !node.expanded;
    this.value = [...this.value];

    const eventName = node.expanded ? 'nui-node-expand' : 'nui-node-collapse';
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { node },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleNodeClick(node: TreeNode) {
    this.dispatchEvent(
      new CustomEvent('nui-node-select', {
        detail: { node },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private get _handlers(): NuiTreeHandlers {
    return {
      onToggle: (node) => this.handleToggle(node),
      onNodeClick: (node) => this.handleNodeClick(node),
    };
  }

  render() {
    const viewState: NuiTreeViewState = {
      value: this.value,
      unstyled: this.unstyled,
      nuiType: this.nuiType,
    };

    return renderTree(viewState, this._handlers);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-tree': NuiTree;
  }
}
