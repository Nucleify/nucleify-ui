import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { type NuiMeterGroupViewState, renderMeterGroup } from './logic.js';
import type { MeterItem } from './types.js';

const styles = createComponentStyles(
  'nui-meter-group',
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-meter-group')
export class NuiMeterGroup
  extends LitElement
  implements NuiMeterGroupViewState
{
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  value: MeterItem[] = [];

  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: String }) orientation: 'horizontal' | 'vertical' =
    'horizontal';
  @property({ type: String, attribute: 'label-position' }) labelPosition:
    | 'start'
    | 'end'
    | 'none' = 'end';
  @property({ type: String, attribute: 'label-orientation' }) labelOrientation:
    | 'horizontal'
    | 'vertical' = 'horizontal';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'meter-group-class' })
  meterGroupClass = '';

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );
  }

  render() {
    return renderMeterGroup(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-meter-group': NuiMeterGroup;
  }
}
