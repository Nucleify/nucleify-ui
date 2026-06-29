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
  maxFileSize: 'max-file-size',
  chooseLabel: 'choose-label',
  uploadLabel: 'upload-label',
  cancelLabel: 'cancel-label',
  customUpload: 'custom-upload',
  fileLimit: 'file-limit',
  fileUploadClass: 'file-upload-class',
  nuiType: 'nui-type',
};

export const NUI_FILE_UPLOAD_DEFAULTS: PlaygroundProps = {
  mode: 'advanced',
  multiple: true,
  accept: 'image/*',
  disabled: false,
  auto: false,
  maxFileSize: '5242880', // 5MB
  chooseLabel: 'Choose',
  uploadLabel: 'Upload',
  cancelLabel: 'Cancel',
  customUpload: false,
  fileLimit: '5',
  fileUploadClass: '',
  unstyled: false,
  nuiType: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'mode',
    label: 'mode',
    type: 'select',
    section: 'Appearance',
    options: [
      { value: 'advanced', label: 'advanced' },
      { value: 'basic', label: 'basic' },
    ],
  },
  {
    key: 'nuiType',
    label: 'nui-type',
    type: 'text',
    section: 'Appearance',
  },
  {
    key: 'chooseLabel',
    label: 'choose-label',
    type: 'text',
    section: 'Labels',
  },
  {
    key: 'uploadLabel',
    label: 'upload-label',
    type: 'text',
    section: 'Labels',
  },
  {
    key: 'cancelLabel',
    label: 'cancel-label',
    type: 'text',
    section: 'Labels',
  },
  {
    key: 'accept',
    label: 'accept',
    type: 'text',
    section: 'Behavior',
  },
  {
    key: 'maxFileSize',
    label: 'max-file-size (bytes)',
    type: 'text',
    section: 'Validation',
  },
  {
    key: 'fileLimit',
    label: 'file-limit',
    type: 'text',
    section: 'Validation',
  },
  {
    key: 'multiple',
    label: 'multiple',
    type: 'boolean',
    section: 'Behavior',
  },
  {
    key: 'disabled',
    label: 'disabled',
    type: 'boolean',
    section: 'Behavior',
  },
  {
    key: 'auto',
    label: 'auto',
    type: 'boolean',
    section: 'Behavior',
  },
  {
    key: 'customUpload',
    label: 'custom-upload',
    type: 'boolean',
    section: 'Behavior',
  },
  {
    key: 'unstyled',
    label: 'unstyled',
    type: 'boolean',
    section: 'Modifiers',
  },
];

function handleSelect(e: Event) {
  console.log('nui-file-upload select event:', (e as CustomEvent).detail);
}

function handleUpload(e: Event) {
  console.log('nui-file-upload upload event:', (e as CustomEvent).detail);
}

function handleRemove(e: Event) {
  console.log('nui-file-upload remove event:', (e as CustomEvent).detail);
}

function handleClear() {
  console.log('nui-file-upload clear event');
}

function handleError(e: Event) {
  console.error('nui-file-upload error event:', (e as CustomEvent).detail);
  alert(`Upload Error: ${(e as CustomEvent).detail.message}`);
}

function renderPreview(
  props: PlaygroundProps,
  _handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  return html`
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 1rem;">
      <nui-file-upload
        mode=${String(props.mode)}
        choose-label=${String(props.chooseLabel)}
        upload-label=${String(props.uploadLabel)}
        cancel-label=${String(props.cancelLabel)}
        accept=${String(props.accept)}
        max-file-size=${Number(props.maxFileSize)}
        file-limit=${Number(props.fileLimit)}
        file-upload-class=${whenString(props.fileUploadClass)}
        nui-type=${whenString(props.nuiType)}
        ?multiple=${whenBoolean(props.multiple)}
        ?disabled=${whenBoolean(props.disabled)}
        ?auto=${whenBoolean(props.auto)}
        ?custom-upload=${whenBoolean(props.customUpload)}
        ?unstyled=${whenBoolean(props.unstyled)}
        @select=${handleSelect}
        @upload=${handleUpload}
        @remove=${handleRemove}
        @clear=${handleClear}
        @error=${handleError}
      ></nui-file-upload>
    </div>
  `;
}

export const nuiFileUploadPlayground: PlaygroundDefinition = {
  tag: 'nui-file-upload',
  label: 'File Upload',
  description:
    'Upload component to select, drag-and-drop and manage file uploads.',
  defaults: NUI_FILE_UPLOAD_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) => {
    return formatUsageFromDefaults(
      'nui-file-upload',
      props,
      NUI_FILE_UPLOAD_DEFAULTS,
      ATTRIBUTE_NAMES,
    );
  },
};
