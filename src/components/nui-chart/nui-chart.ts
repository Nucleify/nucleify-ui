import type { Chart, ChartData, ChartOptions, Plugin } from 'chart.js';
import { LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type NuiType, nuiTypeProperty } from '../../types/nui-type.js';
import {
  createComponentStyles,
  syncStylesWhen,
} from '../../utils/sync-stylesheet.js';
import { ChartController } from './chart-controller.js';
import { type NuiChartViewState, renderChart } from './logic.js';
import type { ChartType } from './types.js';

const styles = createComponentStyles(
  () => import('./styles.css', { with: { type: 'css' } }),
);

@customElement('nui-chart')
export class NuiChart extends LitElement implements NuiChartViewState {
  @property({ type: String }) type: ChartType = 'bar';
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  data: ChartData | null = null;
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  options: ChartOptions = {};
  @property({
    attribute: false,
    hasChanged: (next, prev) => JSON.stringify(next) !== JSON.stringify(prev),
  })
  plugins: Plugin[] = [];
  @property({ type: String }) width = '';
  @property({ type: String }) height = '';
  @property({ type: Boolean }) unstyled = false;
  @nuiTypeProperty nuiType: NuiType = '';
  @property({ type: String, attribute: 'chart-class' }) chartClass = '';

  private controller: ChartController | null = null;
  private initGeneration = 0;

  protected firstUpdated() {
    void styles.sync(this.renderRoot, { unstyled: this.unstyled });
    void this.initChart();
  }

  protected updated(changed: PropertyValues) {
    syncStylesWhen(changed, 'unstyled', () =>
      styles.sync(this.renderRoot, { unstyled: this.unstyled }),
    );

    if (
      changed.has('type') ||
      changed.has('data') ||
      changed.has('options') ||
      changed.has('plugins')
    ) {
      void this.initChart();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.initGeneration += 1;
    void this.controller?.destroy();
    this.controller = null;
  }

  refresh(mode: 'default' | 'none' | 'active' = 'default'): void {
    this.controller?.refresh(mode);
  }

  reinit(): void {
    void this.initChart();
  }

  getChart(): Chart | null {
    return this.controller?.getChart() ?? null;
  }

  generateLegend(): string {
    return this.controller?.generateLegend() ?? '';
  }

  private async initChart(): Promise<void> {
    const generation = ++this.initGeneration;
    await this.updateComplete;

    if (generation !== this.initGeneration) {
      return;
    }

    if (!this.data) {
      await this.controller?.destroy();
      this.controller = null;
      return;
    }

    const canvas = this.renderRoot.querySelector('canvas');

    if (!canvas) {
      return;
    }

    await this.controller?.destroy();
    this.controller = null;

    if (generation !== this.initGeneration) {
      return;
    }

    const controller = new ChartController(canvas);
    this.controller = controller;

    await controller.init({
      type: this.type,
      data: this.data,
      options: this.options,
      plugins: this.plugins,
      onSelect: (detail) => {
        this.dispatchEvent(
          new CustomEvent('select', {
            detail,
            bubbles: true,
            composed: true,
          }),
        );
      },
      onLoaded: (chart) => {
        if (generation !== this.initGeneration) {
          return;
        }

        this.dispatchEvent(
          new CustomEvent('loaded', {
            detail: { chart },
            bubbles: true,
            composed: true,
          }),
        );
      },
    });

    if (generation !== this.initGeneration) {
      await controller.destroy();

      if (this.controller === controller) {
        this.controller = null;
      }
    }
  }

  render() {
    return renderChart(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-chart': NuiChart;
  }
}
