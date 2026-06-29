import { html, type TemplateResult } from 'lit';
import type { SwiperSlideInterface } from '../../components/nui-swiper/types.js';
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
  slidesPerView: 'slides-per-view',
  slidesPerGroup: 'slides-per-group',
  spaceBetween: 'space-between',
  autoplayDelay: 'autoplay-delay',
  nuiType: 'nui-type',
};

export const NUI_SWIPER_DEFAULTS: PlaygroundProps = {
  slidesPerView: '1',
  slidesPerGroup: '1',
  spaceBetween: '10',
  speed: '300',
  navigation: true,
  pagination: true,
  loop: true,
  autoplay: false,
  autoplayDelay: '3000',
  unstyled: false,
  nuiType: '',
};

const CONTROLS: PlaygroundControl[] = [
  {
    key: 'slidesPerView',
    label: 'slides-per-view',
    type: 'select',
    section: 'Layout',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
    ],
  },
  {
    key: 'slidesPerGroup',
    label: 'slides-per-group',
    type: 'select',
    section: 'Layout',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
    ],
  },
  {
    key: 'spaceBetween',
    label: 'space-between (px)',
    type: 'text',
    section: 'Layout',
  },
  {
    key: 'speed',
    label: 'speed (ms)',
    type: 'text',
    section: 'Layout',
  },
  {
    key: 'navigation',
    label: 'navigation',
    type: 'boolean',
    section: 'Features',
  },
  {
    key: 'pagination',
    label: 'pagination',
    type: 'boolean',
    section: 'Features',
  },
  { key: 'loop', label: 'loop', type: 'boolean', section: 'Features' },
  { key: 'autoplay', label: 'autoplay', type: 'boolean', section: 'Features' },
  {
    key: 'autoplayDelay',
    label: 'autoplay-delay (ms)',
    type: 'text',
    section: 'Features',
  },
  { key: 'unstyled', label: 'unstyled', type: 'boolean', section: 'Modifiers' },
  { key: 'nuiType', label: 'nui-type', type: 'text', section: 'Modifiers' },
];

const DEMO_SLIDES: SwiperSlideInterface[] = [
  {
    image: 'https://picsum.photos/id/10/800/400',
    url: 'https://unsplash.com',
  },
  {
    image: 'https://picsum.photos/id/20/800/400',
    url: 'https://unsplash.com',
  },
  {
    image: 'https://picsum.photos/id/30/800/400',
    url: 'https://unsplash.com',
  },
  {
    image: 'https://picsum.photos/id/40/800/400',
    url: 'https://unsplash.com',
  },
  {
    image: 'https://picsum.photos/id/50/800/400',
    url: 'https://unsplash.com',
  },
];

function handleSwiperChange(event: Event) {
  const detail = (event as CustomEvent<{ index: number }>).detail;
  console.log('Swiper active index changed to:', detail.index);
}

function renderPreview(
  props: PlaygroundProps,
  _handlers?: PlaygroundPreviewHandlers,
): TemplateResult {
  return html`
    <div style="max-width: 800px; width: 100%; margin: 0 auto; padding: var(--spacing-md);">
      <nui-swiper
        .slides=${DEMO_SLIDES}
        slides-per-view=${Number(props.slidesPerView) || 1}
        slides-per-group=${Number(props.slidesPerGroup) || 1}
        space-between=${Number(props.spaceBetween) || 0}
        speed=${Number(props.speed) || 300}
        ?navigation=${whenBoolean(props.navigation)}
        ?pagination=${whenBoolean(props.pagination)}
        ?loop=${whenBoolean(props.loop)}
        ?autoplay=${whenBoolean(props.autoplay)}
        autoplay-delay=${Number(props.autoplayDelay) || 3000}
        ?unstyled=${whenBoolean(props.unstyled)}
        nui-type=${whenString(props.nuiType)}
        @nui-change=${handleSwiperChange}
      ></nui-swiper>
    </div>
  `;
}

export const nuiSwiperPlayground: PlaygroundDefinition = {
  tag: 'nui-swiper',
  label: 'Swiper',
  description: 'A touch-enabled carousel slider component.',
  defaults: NUI_SWIPER_DEFAULTS,
  controls: CONTROLS,
  renderPreview,
  formatUsage: (props) =>
    formatUsageFromDefaults(
      'nui-swiper',
      props,
      NUI_SWIPER_DEFAULTS,
      ATTRIBUTE_NAMES,
    ),
};
