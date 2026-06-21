export interface ComponentEntry {
  tag: string;
  label: string;
  description?: string;
  /** Example attributes/props to set on the preview element */
  attributes?: Record<string, string>;
}

/** Add new components here to show them in the playground. */
export const componentRegistry: ComponentEntry[] = [
  {
    tag: 'nui-button',
    label: 'Button',
    description: 'Simple button with primary and secondary variants.',
    attributes: { label: 'Click me', variant: 'primary' },
  },
];
