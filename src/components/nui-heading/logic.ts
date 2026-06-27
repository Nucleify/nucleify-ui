import { html, nothing, type TemplateResult } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import type { NuiType } from '../../types/nui-type.js';
import type { HeadingLevel } from './types.js';

export interface NuiHeadingViewState {
  tag: number;
  text: string;
  nuiType: NuiType;
  headingClass: string;
}

export function chooseHeading(tag: number): HeadingLevel {
  const headings: HeadingLevel[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const index = Math.min(Math.max(Math.trunc(tag), 1), 6) - 1;

  return headings[index];
}

export function getHeadingClass(headingClass: string): string {
  return ['nui-heading', headingClass].filter(Boolean).join(' ');
}

function renderHeadingElement(
  level: HeadingLevel,
  state: NuiHeadingViewState,
): TemplateResult {
  const attrs = {
    class: getHeadingClass(state.headingClass),
    'nui-type': state.nuiType || nothing,
  };
  const content = html`<slot>${state.text || nothing}</slot>`;

  switch (level) {
    case 'h1':
      return html`<h1 class=${attrs.class} nui-type=${attrs['nui-type']}>${content}</h1>`;
    case 'h2':
      return html`<h2 class=${attrs.class} nui-type=${attrs['nui-type']}>${content}</h2>`;
    case 'h3':
      return html`<h3 class=${attrs.class} nui-type=${attrs['nui-type']}>${content}</h3>`;
    case 'h4':
      return html`<h4 class=${attrs.class} nui-type=${attrs['nui-type']}>${content}</h4>`;
    case 'h5':
      return html`<h5 class=${attrs.class} nui-type=${attrs['nui-type']}>${content}</h5>`;
    case 'h6':
      return html`<h6 class=${attrs.class} nui-type=${attrs['nui-type']}>${content}</h6>`;
  }
}

export function renderHeading(state: NuiHeadingViewState): TemplateResult {
  const level = chooseHeading(state.tag);

  return html`${keyed(level, renderHeadingElement(level, state))}`;
}
