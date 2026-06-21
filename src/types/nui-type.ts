import { property } from 'lit/decorators.js';

export type NuiType = string;

export const nuiTypeProperty = property({
  type: String,
  attribute: 'nui-type',
});
