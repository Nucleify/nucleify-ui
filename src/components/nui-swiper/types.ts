import type { NuiType } from '../../types/nui-type.js';

export interface SwiperSlideInterface {
  url?: string;
  prefix?: string;
  image?: string;
}

export interface SwiperProps {
  slides?: SwiperSlideInterface[];
  slidesPerView?: number;
  slidesPerGroup?: number;
  spaceBetween?: number;
  speed?: number;
  navigation?: boolean;
  pagination?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  unstyled?: boolean;
  nuiType?: NuiType;
}
