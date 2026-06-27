import { html, type TemplateResult } from 'lit';
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
  closeOnEscape: 'close-on-escape',
  dismissableMask: 'dismissable-mask',
  dialogClass: 'dialog-class',
  nuiType: 'nui-type',
};

export const NUI_DIALOG_DEFAULTS: PlaygroundProps = {
  visible: false,
  header: 'Edit profile',
  content:
    'Update your information. Dialog content is projected through the default slot.',
  footer: '',
  modal: true,
  closable: true,
  closeOnEscape: true,
  dismissableMask: false,
  position: 'center',
  width: '32rem',
  dialogClass: '',
  unstyled: false,
  nuiType: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'header',
    label: 'header',
    type: 'text',
    section: 'Content',
    placeholder: 'Edit profile',
  },
  {
    key: 'content',
    label: 'content',
    type: 'textarea',
    section: 'Content',
    rows: 4,
    fullWidth: true,
  },
  {
    key: 'footer',
    label: 'footer',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'dialogClass',
    label: 'dialog-class',
    type: 'text',
    section: 'Content',
  },
  {
    key: 'width',
    label: 'width',
    type: 'text',
    section: 'Appearance',
    placeholder: '32rem',
  },
  {
    key: 'position',
    label: 'position',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'center', label: 'center' },
      { value: 'top', label: 'top' },
      { value: 'bottom', label: 'bottom' },
      { value: 'left', label: 'left' },
      { value: 'right', label: 'right' },
      { value: 'topleft', label: 'topleft' },
      { value: 'topright', label: 'topright' },
      { value: 'bottomleft', label: 'bottomleft' },
      { value: 'bottomright', label: 'bottomright' },
    ],
  },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Appearance' },
  {
    key: 'modal',
    label: 'modal',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'closable',
    label: 'closable',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'closeOnEscape',
    label: 'close-on-escape',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'dismissableMask',
    label: 'dismissable-mask',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
  {
    key: 'visible',
    label: 'visible',
    type: 'boolean',
    section: 'State',
  },
];

function handleChange(
  event: Event,
  handlers?: PlaygroundPreviewHandlers,
): void {
  if (!handlers) {
    return;
  }

  const visible = (event as CustomEvent<{ visible: boolean }>).detail.visible;
  handlers.onPropChange('visible', visible);
}

function renderPreview(
  props: PlaygroundProps,
  handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  const visible = Boolean(props.visible);

  return html`
    <div class="dialog-preview">
      <nui-button
        label="Show dialog"
        severity="primary"
        @click=${() => handlers?.onPropChange('visible', true)}
      ></nui-button>

      <nui-dialog
        ?visible=${visible}
        header=${whenString(props.header)}
        footer=${whenString(props.footer)}
        width=${whenString(props.width)}
        position=${String(props.position)}
        dialog-class=${whenString(props.dialogClass)}
        nui-type=${whenString(props.nuiType)}
        ?modal=${whenBoolean(props.modal)}
        ?closable=${whenBoolean(props.closable)}
        ?close-on-escape=${whenBoolean(props.closeOnEscape)}
        ?dismissable-mask=${whenBoolean(props.dismissableMask)}
        ?unstyled=${whenBoolean(props.unstyled)}
        @change=${(event: Event) => handleChange(event, handlers)}
      >
        <nui-paragraph text=${String(props.content)} unstyled></nui-paragraph>
        <div slot="footer">
          <nui-button
            label="Cancel"
            severity="secondary"
            @click=${() => handlers?.onPropChange('visible', false)}
          ></nui-button>
          <nui-button
            label="Save"
            severity="primary"
            @click=${() => handlers?.onPropChange('visible', false)}
          ></nui-button>
        </div>
      </nui-dialog>
    </div>
  `;
}

export const nuiDialogPlayground: PlaygroundDefinition = {
  tag: 'nui-dialog',
  label: 'Dialog',
  description:
    'Modal overlay with header, content, and footer slots; controlled by visible.',
  defaults: NUI_DIALOG_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) => {
    const { content: _content, ...usageProps } = props;

    return formatUsageFromDefaults(
      'nui-dialog',
      usageProps,
      NUI_DIALOG_DEFAULTS,
      ATTRIBUTE_NAMES,
    );
  },
};
