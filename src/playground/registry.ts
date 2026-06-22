import { nuiBadgePlayground } from './definitions/nui-badge.js';
import { nuiButtonPlayground } from './definitions/nui-button.js';
import { nuiIconPlayground } from './definitions/nui-icon.js';
import { nuiTagPlayground } from './definitions/nui-tag.js';
import type { PlaygroundDefinition, PlaygroundProps } from './types.js';

export const playgroundRegistry: PlaygroundDefinition[] = [
  nuiBadgePlayground,
  nuiButtonPlayground,
  nuiIconPlayground,
  nuiTagPlayground,
];

export function getPlaygroundDefinition(
  tag: string,
): PlaygroundDefinition | undefined {
  return playgroundRegistry.find((definition) => definition.tag === tag);
}

export function createInitialPropsState(): Record<string, PlaygroundProps> {
  const state: Record<string, PlaygroundProps> = {};

  for (const definition of playgroundRegistry) {
    state[definition.tag] = { ...definition.defaults };
  }

  return state;
}
