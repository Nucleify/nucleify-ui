import type {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
  Plugin,
} from 'chart.js';

export interface ChartControllerOptions {
  canvas: HTMLCanvasElement;
  type: ChartType;
  data: ChartData;
  options?: ChartOptions;
  plugins?: Plugin[];
  onSelect?: (detail: {
    originalEvent: Event;
    element: unknown;
    dataset: unknown;
  }) => void;
  onLoaded?: (chart: Chart) => void;
}

type ChartModule = typeof import('chart.js/auto');

export class ChartController {
  private chart: Chart | null = null;
  private readonly canvas: HTMLCanvasElement;
  private chartModule: ChartModule | null = null;
  private clickHandler: ((event: MouseEvent) => void) | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  async init(config: Omit<ChartControllerOptions, 'canvas'>): Promise<void> {
    await this.destroy();

    if (!this.chartModule) {
      this.chartModule = await import('chart.js/auto');
    }

    const ChartConstructor = this.chartModule.default;
    const existingChart = ChartConstructor.getChart(this.canvas);

    existingChart?.destroy();

    const chartConfig: ChartConfiguration = {
      type: config.type,
      data: config.data,
      options: config.options,
      plugins: config.plugins,
    };

    this.chart = new ChartConstructor(this.canvas, chartConfig);
    config.onLoaded?.(this.chart);

    this.clickHandler = (event: MouseEvent) => {
      if (!this.chart) {
        return;
      }

      const elements = this.chart.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        false,
      );

      if (elements.length === 0) {
        return;
      }

      const element = elements[0];
      const dataset = this.chart.data.datasets[element.datasetIndex];

      config.onSelect?.({
        originalEvent: event,
        element,
        dataset,
      });
    };

    this.canvas.addEventListener('click', this.clickHandler);
  }

  refresh(mode: 'default' | 'none' | 'active' = 'default'): void {
    this.chart?.update(mode);
  }

  getChart(): Chart | null {
    return this.chart;
  }

  generateLegend(): string {
    return '';
  }

  async destroy(): Promise<void> {
    if (this.clickHandler) {
      this.canvas.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }

    this.chart?.destroy();
    this.chart = null;
  }
}
