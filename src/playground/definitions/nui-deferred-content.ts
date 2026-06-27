import { html, nothing, type TemplateResult } from 'lit';
import {
  formatUsageFromDefaults,
  type PlaygroundControl,
  type PlaygroundDefinition,
  type PlaygroundPreviewHandlers,
  type PlaygroundProps,
  whenBoolean,
  whenString,
} from '../types.js';

const ATTRIBUTE_NAMES: Record<string, string> = {
  scrollContainer: 'scroll-container',
  deferredContentClass: 'deferred-content-class',
  nuiType: 'nui-type',
};

export const NUI_DEFERRED_CONTENT_DEFAULTS: PlaygroundProps = {
  scrollContainer: '.deferred-content-viewport',
  deferredContentClass: '',
  loaded: false,
  unstyled: false,
  nuiType: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'scrollContainer',
    label: 'scroll-container',
    type: 'text',
    section: 'Content',
    placeholder: '.deferred-content-viewport',
  },
  {
    key: 'deferredContentClass',
    label: 'deferred-content-class',
    type: 'text',
    section: 'Content',
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'loaded',
    label: 'loaded (preview state)',
    type: 'boolean',
    section: 'State',
  },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
];

function handleLoad(_event: Event, handlers?: PlaygroundPreviewHandlers): void {
  if (!handlers) {
    return;
  }

  handlers.onPropChange('loaded', true);
}

function renderPreview(
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  const loaded = Boolean(props.loaded);

  return html`
    <div class="deferred-content-demo">
      <p class="deferred-content-status">
        Status:
        <strong>${loaded ? 'loaded' : 'waiting for scroll'}</strong>
      </p>
      <div class="deferred-content-viewport">
        <div class="deferred-content-spacer">
          <p>Scroll this panel down to trigger deferred loading.</p>
          <p>
            Content is injected on <code>@load</code> so images and heavy markup
            are not created until visible.
          </p>
        </div>
        <nui-deferred-content
          scroll-container=${whenString(props.scrollContainer)}
          deferred-content-class=${whenString(props.deferredContentClass)}
          nui-type=${whenString(props.nuiType)}
          ?unstyled=${whenBoolean(props.unstyled)}
          @load=${(event: Event) => handleLoad(event, handlers)}
        >
          ${
            loaded
              ? html`
                  <nui-card title="Deferred card" subtitle="Loaded on scroll">
                    <nui-paragraph slot="content">
                      This card was rendered only after
                      <code>nui-deferred-content</code> entered the viewport.
                    </nui-paragraph>
                  </nui-card>
                `
              : nothing
          }
        </nui-deferred-content>
      </div>
    </div>
  `;
}

export const nuiDeferredContentPlayground: PlaygroundDefinition = {
  tag: 'nui-deferred-content',
  label: 'Deferred content',
  description:
    'Defers slotted content until the element scrolls into view; emits load once.',
  defaults: NUI_DEFERRED_CONTENT_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  getPreviewClass: () => 'is-fluid',
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-deferred-content',
      props,
      NUI_DEFERRED_CONTENT_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
