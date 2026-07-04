import type { NodeEventDetail } from '../../types/component-events.js';
import type { NuiType } from '../../types/nui-type.js';

export interface TreeNode {
  key: string;
  label?: string;
  data?: unknown;
  type?: 'url' | 'default' | string;
  children?: TreeNode[];
  expanded?: boolean;
  class?: string;
  icon?: string;
}

export interface TreeProps {
  value?: TreeNode[];
  unstyled?: boolean;
  nuiType?: NuiType;
}

export interface NuiTreeViewState extends TreeProps {
  // Add any rendering-specific state properties here if needed
}

export interface NuiTreeEventMap {
  'nui-node-expand': CustomEvent<NodeEventDetail<TreeNode>>;
  'nui-node-collapse': CustomEvent<NodeEventDetail<TreeNode>>;
  'nui-node-select': CustomEvent<NodeEventDetail<TreeNode>>;
}
