export type ComponentCategoryId =
  | 'all'
  | 'forms'
  | 'data'
  | 'layout'
  | 'feedback';

export interface ComponentCategory {
  id: ComponentCategoryId;
  label: string;
  title: string;
}

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  { id: 'all', label: 'All', title: 'ALL COMPONENTS' },
  { id: 'forms', label: 'Forms & Inputs', title: 'FORMS & INPUTS' },
  { id: 'data', label: 'Data & Analytics', title: 'DATA & ANALYTICS' },
  { id: 'layout', label: 'Layout & Navigation', title: 'LAYOUT & NAVIGATION' },
  { id: 'feedback', label: 'Feedback & Status', title: 'FEEDBACK & STATUS' },
];

export interface ComponentMeta {
  cat: Exclude<ComponentCategoryId, 'all'>;
  icon: string;
}

export const COMPONENT_METADATA: Record<string, ComponentMeta> = {
  // Forms & Inputs
  'nui-auto-complete': { cat: 'forms', icon: 'mdi:form-textbox' },
  'nui-button': { cat: 'forms', icon: 'mdi:gesture-tap-button' },
  'nui-checkbox': { cat: 'forms', icon: 'mdi:checkbox-marked-outline' },
  'nui-color-picker': { cat: 'forms', icon: 'mdi:palette-outline' },
  'nui-date-picker': { cat: 'forms', icon: 'mdi:calendar' },
  'nui-file-upload': { cat: 'forms', icon: 'mdi:cloud-upload-outline' },
  'nui-float-label': { cat: 'forms', icon: 'mdi:format-text' },
  'nui-input-mask': { cat: 'forms', icon: 'mdi:card-text-outline' },
  'nui-input-number': { cat: 'forms', icon: 'mdi:numeric' },
  'nui-input-otp': { cat: 'forms', icon: 'mdi:form-textbox-password' },
  'nui-input-text': { cat: 'forms', icon: 'mdi:textbox' },
  'nui-knob': { cat: 'forms', icon: 'mdi:knob' },
  'nui-label': { cat: 'forms', icon: 'mdi:label-outline' },
  'nui-listbox': { cat: 'forms', icon: 'mdi:format-list-bulleted' },
  'nui-password': { cat: 'forms', icon: 'mdi:lock-outline' },
  'nui-radio-button': { cat: 'forms', icon: 'mdi:radiobox-marked' },
  'nui-rating': { cat: 'forms', icon: 'mdi:star-outline' },
  'nui-select': { cat: 'forms', icon: 'mdi:form-select' },
  'nui-select-button': { cat: 'forms', icon: 'mdi:toggle-switch-outline' },
  'nui-slider': { cat: 'forms', icon: 'mdi:tune-vertical' },
  'nui-textarea': { cat: 'forms', icon: 'mdi:text-box-multiple-outline' },

  // Data & Analytics
  'nui-avatar': { cat: 'data', icon: 'mdi:account-circle-outline' },
  'nui-badge': { cat: 'data', icon: 'mdi:numeric-1-box-outline' },
  'nui-chart': { cat: 'data', icon: 'mdi:chart-bar' },
  'nui-data-table': { cat: 'data', icon: 'mdi:table-large' },
  'nui-deferred-content': { cat: 'data', icon: 'mdi:clock-fast' },
  'nui-meter-group': { cat: 'data', icon: 'mdi:gauge' },
  'nui-progress-bar': { cat: 'data', icon: 'mdi:progress-horizontal' },
  'nui-progress-spinner': { cat: 'data', icon: 'mdi:progress-helper' },
  'nui-skeleton': { cat: 'data', icon: 'mdi:format-paint' },
  'nui-tag': { cat: 'data', icon: 'mdi:tag-outline' },
  'nui-tree': { cat: 'data', icon: 'mdi:file-tree' },

  // Layout & Navigation
  'nui-accordion': { cat: 'layout', icon: 'mdi:view-sequential' },
  'nui-anchor': { cat: 'layout', icon: 'mdi:link-variant' },
  'nui-card': { cat: 'layout', icon: 'mdi:card-outline' },
  'nui-divider': { cat: 'layout', icon: 'mdi:minus' },
  'nui-dock': { cat: 'layout', icon: 'mdi:dock-bottom' },
  'nui-heading': { cat: 'layout', icon: 'mdi:format-header-pound' },
  'nui-icon': { cat: 'layout', icon: 'mdi:emoticon-happy-outline' },
  'nui-image': { cat: 'layout', icon: 'mdi:image-outline' },
  'nui-logo': { cat: 'layout', icon: 'mdi:cube-outline' },
  'nui-menu': { cat: 'layout', icon: 'mdi:menu' },
  'nui-paragraph': { cat: 'layout', icon: 'mdi:text' },
  'nui-scroll-panel': { cat: 'layout', icon: 'mdi:unfold-more-horizontal' },
  'nui-scroll-top': { cat: 'layout', icon: 'mdi:arrow-up-bold-box-outline' },
  'nui-speed-dial': { cat: 'layout', icon: 'mdi:plus-circle-outline' },
  'nui-swiper': { cat: 'layout', icon: 'mdi:view-carousel-outline' },
  'nui-tabs': { cat: 'layout', icon: 'mdi:tab' },
  'nui-tile': { cat: 'layout', icon: 'mdi:view-grid-outline' },

  // Feedback & Status
  'nui-dialog': { cat: 'feedback', icon: 'mdi:message-outline' },
  'nui-popover': { cat: 'feedback', icon: 'mdi:tooltip-text-outline' },
  'nui-terminal': { cat: 'feedback', icon: 'mdi:console' },
  'nui-toast': { cat: 'feedback', icon: 'mdi:bell-ring-outline' },
  'nui-tooltip': { cat: 'feedback', icon: 'mdi:tooltip-outline' },
};

export function getComponentCategory(
  tag: string,
): Exclude<ComponentCategoryId, 'all'> {
  return COMPONENT_METADATA[tag]?.cat ?? 'layout';
}

export function getComponentIcon(tag: string): string {
  return COMPONENT_METADATA[tag]?.icon ?? 'mdi:cube-outline';
}
