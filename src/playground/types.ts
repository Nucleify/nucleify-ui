import type { TemplateResult } from 'lit';
import { nothing } from 'lit';

export type PlaygroundControlType = 'text' | 'textarea' | 'boolean' | 'select';

export interface PlaygroundControl {
  key: string;
  label: string;
  type: PlaygroundControlType;
  section: string;
  placeholder?: string;
  rows?: number;
  fullWidth?: boolean;
  options?: { value: string; label: string }[];
}

export type PlaygroundProps = Record<string, string | boolean>;

export interface PlaygroundPreviewHandlers {
  onPropChange: (key: string, value: string | boolean) => void;
}

export interface PlaygroundDefinition {
  tag: string;
  label: string;
  description?: string;
  defaults: PlaygroundProps;
  controls: PlaygroundControl[];
  formatUsage: (props: PlaygroundProps) => string;
  renderPreview: (
    props: PlaygroundProps,
    handlers?: PlaygroundPreviewHandlers,
  ) => TemplateResult | HTMLElement;
  onPropChange?: (
    key: string,
    value: string | boolean,
    props: PlaygroundProps,
  ) => Partial<PlaygroundProps> | undefined;
  getPreviewClass?: (props: PlaygroundProps) => string;
}

export interface ThemeChangeDetail {
  palette: 'nuxt' | 'next';
  mode: 'light' | 'dark';
}

export interface PropChangeDetail {
  key: string;
  value: string | boolean;
}

export function groupControlsBySection(
  controls: PlaygroundControl[],
): Map<string, PlaygroundControl[]> {
  const sections = new Map<string, PlaygroundControl[]>();

  for (const control of controls) {
    const group = sections.get(control.section) ?? [];
    group.push(control);
    sections.set(control.section, group);
  }

  return sections;
}

/** Omit empty string attributes from Lit templates. */
export function whenString(value: unknown): typeof nothing | string {
  if (value === undefined || value === null || value === '') {
    return nothing;
  }

  return String(value);
}

/** Omit false boolean attributes from Lit templates. */
export function whenBoolean(value: unknown): typeof nothing | true {
  return value ? true : nothing;
}

/** Omit string attributes equal to a default value. */
export function whenStringNotDefault(
  value: unknown,
  defaultValue: unknown,
): typeof nothing | string {
  if (value === undefined || value === null || value === '') {
    return nothing;
  }

  if (value === defaultValue) {
    return nothing;
  }

  return String(value);
}

export function formatUsageFromDefaults(
  tag: string,
  props: PlaygroundProps,
  defaults: PlaygroundProps,
  attributeNames: Record<string, string> = {},
): string {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(props)) {
    const defaultValue = defaults[key];
    if (value === defaultValue) {
      continue;
    }

    const attr = attributeNames[key] ?? key;

    if (typeof value === 'boolean') {
      if (value) {
        if (defaultValue === false) {
          parts.push(attr);
        }
      } else if (defaultValue === true) {
        parts.push(`${attr}="false"`);
      }
      continue;
    }

    if (value === '') {
      continue;
    }

    parts.push(`${attr}="${value}"`);
  }

  return parts.length
    ? `<${tag} ${parts.join(' ')}></${tag}>`
    : `<${tag}></${tag}>`;
}
